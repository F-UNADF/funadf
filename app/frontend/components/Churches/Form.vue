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
      <v-tabs color="primary" class="mb-3" align-tabs="center" v-model="tab">
        <v-tab value="infos">Informations générales</v-tab>
        <v-tab value="membres">Membres</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item key="infos" value="infos">
          <v-text-field
              v-model="editedItem.name"
              label="Nom"
              :rules="[rules.required]"
              required>
          </v-text-field>
          <v-text-field
              v-model="editedItem.address_1"
              label="Adresse"
              :rules="[rules.required]"
              required>
          </v-text-field>
          <v-text-field
              v-model="editedItem.address_2"
              label="Complément d'adresse"
              :rules="[rules.required]"
              required>
          </v-text-field>
          <v-row>
            <v-col cols="12" lg="6" md="6">
              <v-text-field
                  v-model="editedItem.zipcode"
                  label="Code postal"
                  :rules="[rules.required]"
                  required>
              </v-text-field>
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <v-text-field
                  v-model="editedItem.town"
                  label="Ville"
                  :rules="[rules.required]"
                  required>
              </v-text-field>
            </v-col>
          </v-row>
          <v-text-field
              v-model="editedItem.email"
              label="Email"
              :rules="[rules.required]"
              required>
          </v-text-field>
          <v-text-field
              v-model="editedItem.phone"
              label="Téléphone"
              :rules="[rules.required]"
              required>
          </v-text-field>
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-card-actions class="bg-blue-lighten-5">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="close()">Annuler</v-btn>
      <v-btn color="blue" @click="save()">Enregistrer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "ChurchForm",
  computed: {
    ...mapGetters('churchesStore', {
      items: 'getItems',
      item: 'getItem',
      formLoading: 'getFormLoading',
      dialogForm: 'getDialogForm',
      referentiels: 'getReferentiels',
    }),
    getTitle() {
      return (this.editedItem.id === null) ? "Ajouter une église" : "Modifier une église";
    }
  },
  methods: {
    close() {
      this.$store.commit('churchesStore/setDialogForm', false);
      this.$store.commit('churchesStore/setItem', {});
    },
    save() {
      this.$store.dispatch('churchesStore/save', this.editedItem).then(response => {
        this.$root.showSnackbar('Eglise enregistrée avec succès', 'success');
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de l\'eglise', 'error');
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
      tab: 'infos',
      rules: {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },
}
</script>

<style scoped>

</style>