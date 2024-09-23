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
        <v-col cols="12" md="12">
          <v-select v-model="editedItem.user_id" :items="users" item-id="id" item-value="name" label="Utilisateur">
          </v-select>
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
    users() {
    return this.referentiel.users.map(user => {
      return {
          id: user.id,
          text: user.lastname + ' ' + user.firstname
        };
      })
  
    },
  },
  methods: {
    close: function () {
      this.$store.commit('feesStore/setDialogForm', false);
      this.$store.commit('feesStore/setItem', {});
    },
    save: function () {
      this.$store.dispatch('feesStore/save', {
        post: this.editedItem,
        files: this.files
      }).then(response => {
        this.$root.showSnackbar('Cotisation enregistrée avec succès', 'success');
        this.close();
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de la cotisation', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler: function () {
        this.editedItem = JSON.parse(JSON.stringify(this.item));
      },
    },
  },

  data() {
    return {
      editedItem: {},
      rules: {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },

}
</script>
