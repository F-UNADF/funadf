<template>
  <v-row justify="space-between">
    <v-col cols="12" lg="4" md="4" class="mb-3">
      <v-text-field density="compact" v-model="search" label="Chercher un rassemblement..." hide-details
        variant="outlined" clearable></v-text-field>
    </v-col>
    <v-col cols="12" lg="3" md="3" class="text-right">
      <v-spacer></v-spacer>
      <v-btn color="white" class="me-3" @click="refresh()" icon size="small">
        <v-icon color="primary">mdi-reload</v-icon>
      </v-btn>
      <v-btn color="primary" class="ml-auto" @click="newItem()">
        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
        Ajouter un rassemblement
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table :headers="headers" :items="filteredItems" :search="search" class="elevation-1" :loading="loading">
    <template v-slot:no-data>
      <tr>
        <td colspan="5">
          <v-progress-linear indeterminate color="cyan" v-if="loading"></v-progress-linear>
          <v-alert v-else color="danger" icon="danger" title="Aucun rassemblement n'a été trouvé"
            text="Aucun rassemblement ne correspond à votre recherche. Si vous pensez à une erreur, contactez le support."></v-alert>
        </td>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.name }}</td>
        <td><code class="text-grey">{{ formatedDate(item.start_at) }} - {{ formatedDate(item.start_at) }}</code></td>
        <td>
          <v-tooltip location="top" text="Modifier l'actu">
            <template v-slot:activator="{ props }">
              <v-icon small v-bind="props" color="primary" @click="editItem(item)" title="Edit">
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
    <meeting-form></meeting-form>
  </v-dialog>
  <v-dialog max-width="25%" v-model="dialogConfirmDelete">
    <v-card>
      <v-card-text>
        Etes-vous sûr de vouloir supprimer ce rassemblent, les campagnes associées ne seront pas supprimées mais elles ne
        bénéficiertont plus de la vérification de présence à l'événement ?
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
import { VDataTable } from 'vuetify/labs/VDataTable';
import MeetingForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";
import moment from "moment";

export default {
  name: "meetingsIndex",
  components: {
    VDataTable,
    MeetingForm,
    DialogConfirm,
  },
  computed: {
    ...mapGetters('meetingsStore', {
      items: 'getItems',
      loading: 'getLoading',
    }),
    dialogForm: {
      get() {
        return this.$store.state.meetingsStore.dialogForm;
      },
      set(value) {
        this.$store.commit('meetingsStore/setDialogForm', value);
      },
    },
    filteredItems() {
      return this.items.filter(item => {
        return true;
      });
    },
  },
  methods: {
    newItem: function () {
      let newItem = {
        id: null,
        name: '',
        start_at: '',
        end_at: '',
        description: '',
      };
      this.$store.commit('meetingsStore/setItem', newItem);
      this.$store.commit('meetingsStore/setDialogForm', true);
    },
    editItem: function (item) {
      this.$store.dispatch('meetingsStore/item', item);
      this.$store.commit('meetingsStore/setDialogForm', true);
    },
    refresh: function () {
      this.$store.dispatch('meetingsStore/items');
    },
    tryDeleteItem: function (item) {
      Object.assign(this.deletingItem, item);
      this.dialogConfirmDelete = true;
    },
    deleteItem: function (item) {
      this.$store.dispatch('meetingsStore/delete', item.value).then(response => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar('Rassemblement supprimé avec succès', 'success');
      });
    },
    formatedDate: function (value) {
      return value && value !== '' ? moment(value).format("DD/MM/YYYY") : null;
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
          title: 'Nom',
          key: 'name',
          sortable: true
        },
        {
          title: 'Date',
          key: 'begin_at',
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
    this.$store.dispatch('meetingsStore/items');
    this.$store.dispatch('meetingsStore/referentiels');
  },
}
</script>

<style scoped></style>