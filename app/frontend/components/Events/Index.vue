<template>
  <div class="list-toolbar">
    <v-text-field density="compact" v-model="search" label="Rechercher un événement" prepend-inner-icon="mdi-magnify"
      hide-details variant="outlined" clearable class="list-toolbar__search"></v-text-field>
    <v-btn icon="mdi-refresh" variant="text" color="primary" aria-label="Actualiser la liste" @click="refresh()"></v-btn>
    <v-spacer></v-spacer>
    <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="newItem()">
      Ajouter un événement
    </v-btn>
  </div>

  <v-data-table :headers="headers" :items="filteredItems" :search="search" class="elevation-1" :loading="loading" hover>
    <template v-slot:no-data>
      <div class="list-empty">
        <p class="text-subtitle-1 font-weight-medium mb-1">
          {{ search ? `Aucun événement ne correspond à « ${search} »` : 'Aucun événement pour le moment' }}
        </p>
        <v-btn v-if="search" variant="text" color="primary" @click="search = ''">Effacer la recherche</v-btn>
        <v-btn v-else variant="tonal" color="primary" prepend-icon="mdi-plus" @click="newItem()">Ajouter un événement</v-btn>
      </div>
    </template>
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@3"></v-skeleton-loader>
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
          <v-chip size="small" variant="tonal" color="primary">
            {{ item.category.name }}
          </v-chip>
        </td>
        <td class="text-right text-no-wrap">
          <row-action icon="mdi-pencil" color="primary" label="Modifier l'événement" @click="editItem(item.id)"></row-action>

          <row-action icon="mdi-delete-outline" color="error" label="Supprimer l'événement" @click="tryDeleteItem(item)"></row-action>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogForm" max-width="960">
    <event-form @refresh="refresh()"></event-form>
  </v-dialog>
  <v-dialog max-width="440" v-model="dialogConfirmDelete">
    <v-card title="Supprimer l’événement ?">
      <v-card-text><strong>{{ deletingItem.title }}</strong><p class="mt-2">Cette action est irréversible.</p></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialogConfirmDelete = false">Annuler</v-btn>
        <v-btn color="error" variant="flat" @click="deleteItem(deletingItem)">Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import EventForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";
import RowAction from "../Tools/RowAction.vue";
import moment from "moment";

export default {
  name: "EventsIndex",
  components: {
    RowAction,
    EventForm,
    DialogConfirm,
  },
  props: {
    domain: {
      type: String,
      default: 'me',
    },
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
      return this.items;
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
      this.$store.dispatch('eventsStore/items', { domain: this.domain });
    },
    tryDeleteItem: function (item) {
      this.deletingItem = { ...item };
      this.dialogConfirmDelete = true;
    },
    deleteItem: function (item) {
      this.$store.dispatch('eventsStore/delete', item.id).then(response => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.refresh();
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
      search: '',
      dialog: false,
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
          sortable: false,
          align: 'end'
        },
      ],
    }
  },
  beforeMount: function () {
    this.refresh();
    this.$store.dispatch('eventsStore/referentiels', { domain: this.domain });
  },
}
</script>

<style scoped></style>