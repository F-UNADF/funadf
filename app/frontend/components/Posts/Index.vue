<template>
  <v-row justify="space-between">
    <v-col cols="12" lg="4" md="4" class="mb-3">
      <v-text-field density="compact" v-model="search" label="Chercher une actu..." hide-details variant="outlined"
        clearable></v-text-field>
    </v-col>
    <v-col cols="12" lg="3" md="3" class="text-right">
      <v-spacer></v-spacer>
      <v-btn color="white" class="me-3" @click="refresh()" icon size="small">
        <v-icon color="primary">mdi-reload</v-icon>
      </v-btn>
      <v-btn color="primary" class="ml-auto" @click="newItem()">
        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
        Ajouter une actu
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table :headers="headers" :items="filteredItems" :search="search" class="elevation-1" :loading="loading">
    <template v-slot:no-data>
      <tr>
        <td colspan="5">
          <v-progress-linear indeterminate color="cyan" v-if="loading"></v-progress-linear>
          <v-alert v-else color="danger" icon="danger" title="Aucune actu trouvée"
            text="Aucune actu ne correspond à votre recherche. Si vous pensez à une erreur, contactez le support."></v-alert>
        </td>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.title }}</td>
        <td>
          <template v-if="item.structure">
            {{ item.structure.name }}
          </template>
        </td>
        <td>
          {{ formatedDate(item.created_at) }}
        </td>
        <td>
          <v-tooltip location="top" text="Modifier l'actu">
            <template v-slot:activator="{ props }">
              <v-icon small v-bind="props" color="primary" @click="editItem(item.id)" title="Edit">
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Supprimer l'actu">
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

  <v-dialog v-model="dialogForm" max-width="75%">
    <post-form></post-form>
  </v-dialog>
  <v-dialog max-width="25%" v-model="dialogConfirmDelete">
    <v-card>
      <v-card-text>
        Etes-vous sûr de vouloir supprimer cette actu ?
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
import { VDataTable } from 'vuetify/labs/VDataTable'
import PostForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";
import moment from "moment";

export default {
  name: "PostsIndex",
  components: {
    VDataTable,
    PostForm,
    DialogConfirm,
  },
  computed: {
    ...mapGetters('postsStore', {
      items: 'getItems',
      loading: 'getLoading',
      referentiels: 'getReferentiels',
    }),
    dialogForm: {
      get() {
        return this.$store.state.postsStore.dialogForm;
      },
      set(value) {
        this.$store.commit('postsStore/setDialogForm', value);
      },
    },
    filteredItems() {
      return this.items.filter(item => {
        return true;
      });
    },
  },
  methods: {
    formatedDate: function (date) {
      return moment(date).format('DD/MM/YYYY HH:mm');
    },
    newItem: function () {
      let newItem = {
        id: null,
        title: '',
        content: '',
        accesses: [],
      };
      this.$store.commit('postsStore/setItem', newItem);
      this.$store.commit('postsStore/setDialogForm', true);
    },
    editItem: function (item) {
      this.$store.dispatch('postsStore/item', item);
      this.$store.commit('postsStore/setDialogForm', true);
    },
    refresh: function () {
      this.$store.dispatch('postsStore/items');
    },
    tryDeleteItem: function (item) {
      Object.assign(this.deletingItem, item);
      this.dialogConfirmDelete = true;
    },
    deleteItem: function (item) {
      this.$store.dispatch('postsStore/delete', item.id).then(response => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar('Actualité supprimée avec succès', 'success');
      });
    },
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
        {
          title: 'Titre',
          key: 'title',
          sortable: true
        },
        {
          title: 'Structure',
          key: 'structure.name',
          sortable: true
        },
        {
          title: 'Créé le',
          key: 'created_at',
          sortable: true
        },
        {
          title: 'Actions',
          key: 'actions',
          sortable: false
        },
      ],
    }
  },
  beforeMount: function () {
    this.$store.dispatch('postsStore/items');
    this.$store.dispatch('postsStore/referentiels');
  },
}
</script>

<style scoped></style>