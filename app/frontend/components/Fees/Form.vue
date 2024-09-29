<template>
  <v-progress-circular v-if="formLoading" indeterminate color="primary"></v-progress-circular>
  <v-card v-else>
    <v-card-title class="bg-blue text-white">
      <v-btn @click="close()" icon size="small" color="white" variant="outlined" class="mr-5">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      {{ this.getTitle }}
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="12">
          <v-select v-model="editedItem.what" :items="years" label="Année" hide-details></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="editedItem.member_type" :items="['User', 'Structure']" label="Type de membre"
            hide-details></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete :items="this.matchingUsers" v-model="editedItem.member_id" label="Membre"
            :item-value="item => item.value" v-model:search="search" no-filter v-if="editedItem.member_type"
            no-data-text="Utilisateur déjà renseigné ou inexistant"
            hint="Merci d'indiquer les trois premières lettres du nom ou du prénom." persistent-hint>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field v-model="editedItem.amount" label="Montant" hide-details></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field v-model="editedItem.paid_at" type="date" label="Payé le" :rules="[rules.required]"
            :value="getIsoDate(editedItem.paid_at)" hint="Exemple : 18/09/2021" persistent-hint required>
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="bg-blue-lighten-5">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="close()">Annuler</v-btn>
      <v-btn color="blue" @click="save()">Enregistrer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "FeeForm",
  computed: {
    ...mapGetters('feesStore', {
      item: 'getItem',
      formLoading: 'getFormLoading',
      dialogForm: 'getDialogForm',
      referentiel: 'getReferentiel'
    }),
    getTitle() {
      return (this.editedItem.id === null) ? "Ajouter une cotisation" : "Modifier une cotisation";
    },
    years() {
      let years = [null];
      let currentYear = moment().year() + 1;
      for (let i = currentYear; i >= 2017; i--) {
        years.push(i.toString());
      }
      return years;
    },
  },
  methods: {
    close: function () {
      this.$store.dispatch('feesStore/items');
      this.$store.commit('feesStore/setDialogForm', false);
      this.$store.commit('feesStore/setItem', {});
    },
    getIsoDate: function (value) {
      return moment(value).format('YYYY-MM-DD');
    },
    save: function () {
      this.$store.dispatch('feesStore/save', {
        fee: this.editedItem
      }).then(response => {
        this.$root.showSnackbar('Cotisation enregistrée avec succès', 'success');
        this.close();
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de la cotisation', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    onUserSelected(selectedItem) {
      console.log(selectedItem);
      if (selectedItem && selectedItem.type) {
        this.editedItem.member_type = selectedItem.type;
      }
    }
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler: function () {
        this.editedItem = JSON.parse(JSON.stringify(this.item));
      },
    },
    search: function (val) {
      if (val.length < 3) {
        // si editedItem.member_id est defini, on le garde

        // On a deux referenciels users et structures
        // Si member_type = User on tape sur users
        // Si member_type = Structure on tape sur structures
        if (this.editedItem.member_id) {
          if (this.editedItem.member_type === 'User') {
            this.matchingUsers = this.referentiel.users.filter(user => {
              return user.id === this.editedItem.member_id;
            }).map(user => {
              return {
                value: user.id,
                type: 'User',
                title: user.lastname + ' ' + user.firstname
              };
            });
          }

          if (this.editedItem.member_type === 'Structure') {
            this.matchingUsers = this.referentiel.structures.filter(structure => {
              return structure.id === this.editedItem.member_id;
            }).map(structure => {
              return {
                value: structure.id,
                type: 'Structure',
                title: structure.name + ' (' + structure.zipcode + ' - ' + structure.town + ')'
              };
            });
          }
        }
        return;
      }

      if (this.editedItem.member_type === 'User') {
        this.matchingUsers = this.referentiel.users.filter(user => {
          return user.lastname.toLowerCase().includes(val.toLowerCase()) || user.firstname.toLowerCase().includes(val.toLowerCase());
        }).map(user => {
          return {
            value: user.id,
            title: user.lastname + ' ' + user.firstname
          };
        });
      }

      if (this.editedItem.member_type === 'Structure') {
        this.matchingUsers = this.referentiel.structures.filter(structure => {
          return structure.name.toLowerCase().includes(val.toLowerCase()) ||
            (structure.zipcode && structure.zipcode.toLowerCase().includes(val.toLowerCase())) ||
            (structure.town && structure.town.toLowerCase().includes(val.toLowerCase()));
        }).map(structure => {
          return {
            value: structure.id,
            title: structure.name + ' (' + structure.zipcode + ' - ' + structure.town + ')'
          };
        });
      }
    },
  },

  data() {
    return {
      editedItem: {},
      search: '',
      matchingUsers: [],
      rules: {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },

}
</script>
