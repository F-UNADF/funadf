<template>
  <v-toolbar flat color="transparent" class="mb-3">
      <v-text-field density="compact" v-model="search" label="Chercher une association (Nom, Ville...)" hide-details
        variant="outlined" clearable></v-text-field>
    
        
      <v-spacer></v-spacer>
      <v-btn color="white" class="me-3" @click="refresh()" icon>
        <v-icon color="primary">mdi-reload</v-icon>
      </v-btn>
      <v-btn color="primary" variant="flat" class="ml-auto" @click="newItem()" v-if="canAddAssociation">
        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
        Ajouter une association
      </v-btn>
  </v-toolbar>
  <v-data-table :headers="headers" :items="filteredItems" :search="search" class="elevation-1" :loading="loading">
    <template v-slot:no-data>
      <tr>
        <td colspan="5">
          <v-progress-linear indeterminate color="cyan" v-if="loading"></v-progress-linear>
          <v-alert v-else color="danger" icon="danger" title="Aucune association trouvée"
            text="Aucune association ne correspond à votre recherche. Si vous pensez à une erreur, contactez le support."></v-alert>
        </td>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.id }}</td>
        <td>
          <div class="d-flex align-center py-4">
            <v-avatar :image="'/logos/' + item.id + '.png'"></v-avatar>
            <div class="ml-5">
              <h4>{{ item.name }}</h4>
              <span class="subtitle-2 d-block font-weight-regular">{{
                itememail
              }}</span>
            </div>
          </div>
        </td>
        <td>{{ item.zipcode }} {{ item.town }}</td>
        <td>
          <v-tooltip location="top" text="Modifier l'association">
            <template v-slot:activator="{ props }">
              <v-icon small v-bind="props" color="primary" @click="editItem(item)" title="Edit">
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Supprimer l'association">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" small class="text-error" title="Delete" @click="tryDeleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-tooltip>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogForm" fullscreen>
    <association-form></association-form>
  </v-dialog>
  <v-dialog max-width="25%" v-model="dialogConfirmDelete">
    <v-card>
      <v-card-text>
        Etes-vous sûr de vouloir supprimer cette association ?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialogConfirmDelete = false">Annuler</v-btn>
        <v-btn color="error" @click="deleteItem(deletingItem)">Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import AssociationForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";

export default {
  name: "AssociationsIndex",
  components: {
    AssociationForm,
    DialogConfirm,
  },
  computed: {
    ...mapGetters('associationsStore', {
      items: 'getItems',
      loading: 'getLoading',
      referentiels: 'getReferentiels',
    }),
    ...mapGetters('sessionStore', {
      subdomain: 'subdomain',
    }),
    dialogForm: {
      get() {
        return this.$store.state.associationsStore.dialogForm;
      },
      set(value) {
        this.$store.commit('associationsStore/setDialogForm', value);
      },
    },
    filteredItems() {
      return this.items.filter(item => {
        return true;
      });
    },
    canAddAssociation() {
      return this.subdomain === 'admin';
    }
  },
  methods: {
    newItem: function () {
      let newItem = {
      };
      this.$store.commit('associationsStore/setItem', newItem);
      this.$store.commit('associationsStore/setDialogForm', true);
    },
    editItem: function (item) {
      this.$store.dispatch('associationsStore/item', item.id);
      this.$store.commit('associationsStore/setDialogForm', true);
    },
    refresh: function () {
      this.$store.dispatch('associationsStore/items');
    },
    tryDeleteItem: function (item) {
      Object.assign(this.deletingItem, item);
      this.dialogConfirmDelete = true;
    },
    deleteItem: function (item) {
      this.$store.dispatch('associationsStore/delete', item.id).then(response => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar('Association supprimée avec succès', 'success');
      });
    }
  },
  data() {
    return {
      deletingItem: {},
      dialogConfirmDelete: false,
      loadingDelete: false,
      search: '',
      dialog: false,
      editedItem: {},
      valid: true,
      filter: {
        levels: [],
        disabled: false,
      },
      headers: [
        { title: 'ID', key: 'id', sortable: true },
        { title: 'Nom', key: 'name', sortable: true },
        { title: 'Ville', align: 'start', key: 'town', sortable: true },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
    }
  },
  beforeMount: function () {
    this.$store.dispatch('associationsStore/items');
    this.$store.dispatch('associationsStore/referentiels');
  },
}
</script>

<style scoped></style>