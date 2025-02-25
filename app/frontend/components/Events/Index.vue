<template>
  <v-row justify="space-between">
    <v-col cols="12" lg="4" md="4" class="mb-3">
      <v-text-field density="compact" v-model="search" label="Chercher un événement..." hide-details variant="outlined"
        clearable></v-text-field>
    </v-col>
    <v-col cols="12" lg="3" md="3" class="text-right">
      <v-spacer></v-spacer>
      <v-btn color="white" class="me-3" @click="refresh()" icon size="small">
        <v-icon color="primary">mdi-reload</v-icon>
      </v-btn>
      <v-btn color="primary" class="ml-auto" @click="newItem()">
        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
        Ajouter un événement
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table :headers="headers" :items="filteredItems" :search="search" class="elevation-1" :loading="loading">
    <template v-slot:no-data>
      <tr>
        <td colspan="5">
          <v-progress-linear indeterminate color="cyan" v-if="loading"></v-progress-linear>
          <v-alert v-else color="danger" icon="danger" title="Aucun événement trouvé"
            text="Aucun événement ne correspond à votre recherche. Si vous pensez à une erreur, contactez le support."></v-alert>
        </td>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.title }}</td>
        <td>
          Du {{ getCleanDate(item.start_at) }} au {{ getCleanDate(item.end_at) }}
        </td>
        <td>
          {{ item.structure.name }}
        </td>
        <td>
          <v-chip color="primary" text-color="white" small>
            {{ item.category.name }}
          </v-chip>
        </td>
        <td>
          <v-tooltip location="top" text="Modifier l'événement">
            <template v-slot:activator="{ props }">
              <v-icon small v-bind="props" color="primary" @click="editItem(item.id)" title="Edit">
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Supprimer l'événement">
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
    <event-form></event-form>
  </v-dialog>
  <v-dialog max-width="25%" v-model="dialogConfirmDelete">
    <v-card>
      <v-card-text>
        Etes-vous sûr de vouloir supprimer cet événement ?
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
import EventForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";
import moment from "moment";

export default {
  name: "EventsIndex",
  components: {
    EventForm,
    DialogConfirm,
  },
  computed: {
    ...mapGetters('eventsStore', {
      items: 'getItems',
      loading: 'getLoading',
      referentiels: 'getReferentiels',
    }),
    dialogForm: {
      get() {
        return this.$store.state.eventsStore.dialogForm;
      },
      set(value) {
        this.$store.commit('eventsStore/setDialogForm', value);
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
        title: '',
        start_at: '',
        end_at: '',
        description: '',
        accesses: [],
      };
      this.$store.commit('eventsStore/setItem', newItem);
      this.$store.commit('eventsStore/setDialogForm', true);
    },
    editItem: function (item) {
      this.$store.dispatch('eventsStore/item', item);
      this.$store.commit('eventsStore/setDialogForm', true);
    },
    refresh: function () {
      this.$store.dispatch('eventsStore/items');
    },
    tryDeleteItem: function (item) {
      Object.assign(this.deletingItem, item);
      this.dialogConfirmDelete = true;
    },
    deleteItem: function (item) {
      this.$store.dispatch('eventsStore/delete', item.value).then(response => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar('Événement supprimé avec succès', 'success');
      });
    },
    getCleanDate: function (value) {
      return moment(value).format("DD/MM/YYYY HH:mm");
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
          title: 'Dates',
          key: 'start_at',
          sortable: true
        },
        {
          title: 'Association',
          key: 'structure.name',
          sortable: true
        },
        {
          title: 'Catégorie',
          key: 'category.name',
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
    this.$store.dispatch('eventsStore/items');
    this.$store.dispatch('eventsStore/referentiels');
  },
}
</script>

<style scoped></style>