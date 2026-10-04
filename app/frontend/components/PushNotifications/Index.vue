<template>
  <div class="list-toolbar">
    <v-text-field density="compact" v-model="search" label="Rechercher une notification" prepend-inner-icon="mdi-magnify"
      hide-details variant="outlined" clearable class="list-toolbar__search"></v-text-field>
    <v-btn icon="mdi-refresh" variant="text" color="primary" aria-label="Actualiser la liste" @click="refresh()"></v-btn>
    <v-spacer></v-spacer>
    <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="newItem()">
      Rédiger une notification
    </v-btn>
  </div>
  <v-data-table :headers="headers" :items="filteredItems" :search="search" class="elevation-1" :loading="loading" hover>
    <template v-slot:no-data>
      <div class="list-empty">
        <p class="text-subtitle-1 font-weight-medium mb-1">
          {{ search ? `Aucune notification ne correspond à « ${search} »` : 'Aucune notification rédigée pour le moment' }}
        </p>
        <v-btn v-if="search" variant="text" color="primary" @click="search = ''">Effacer la recherche</v-btn>
        <v-btn v-else variant="tonal" color="primary" prepend-icon="mdi-plus" @click="newItem()">Rédiger une notification</v-btn>
      </div>
    </template>
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@3"></v-skeleton-loader>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td class="py-2">
          <div class="font-weight-medium">{{ item.title }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ item.body }}</div>
        </td>
        <td class="text-right text-no-wrap">

          <row-action icon="mdi-send" color="success" label="Envoyer la notification" @click="askSend(item)"></row-action>

          <row-action icon="mdi-pencil" color="primary" label="Modifier la notification" @click="editItem(item.id)"></row-action>

          <row-action icon="mdi-delete-outline" color="error" label="Supprimer la notification" @click="tryDeleteItem(item)"></row-action>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog max-width="640" v-model="dialogForm">
    <push-notification-form></push-notification-form>
  </v-dialog>
  <v-dialog max-width="440" v-model="dialogConfirmDelete">
    <v-card title="Supprimer la notification ?">
      <v-card-text><strong>{{ deletingItem.title }}</strong><p class="mt-2">Cette action est irréversible.</p></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialogConfirmDelete = false">Annuler</v-btn>
        <v-btn color="error" variant="flat" @click="deleteItem(deletingItem)">Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- L'envoi d'une notification push est immédiat et ne peut pas être annulé -->
  <v-dialog max-width="480" v-model="dialogConfirmSend">
    <v-card title="Envoyer la notification ?">
      <v-card-text>
        <div class="font-weight-medium">{{ sendingItem.title }}</div>
        <div class="text-body-2 text-medium-emphasis mb-3">{{ sendingItem.body }}</div>
        <p>Elle sera envoyée immédiatement sur les téléphones et navigateurs des destinataires. L’envoi ne peut pas être annulé.</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialogConfirmSend = false">Annuler</v-btn>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-send" :loading="sending" @click="confirmSend()">Envoyer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import PushNotificationForm from './Form.vue';
import DialogConfirm from "../Tools/DialogConfirm.vue";
import RowAction from "../Tools/RowAction.vue";
import moment from "moment";

export default {
  name: "PushNotificationsIndex",
  components: {
    RowAction,
    PushNotificationForm,
    DialogConfirm,
  },
  computed: {
    ...mapGetters('pushNotificationsStore', {
      items: 'getItems',
      loading: 'getLoading',
    }),
    dialogForm: {
      get() {
        return this.$store.state.pushNotificationsStore.dialogForm;
      },
      set(value) {
        this.$store.commit('pushNotificationsStore/setDialogForm', value);
      },
    },
    filteredItems() {
      return this.items
    },
  },
  methods: {
    newItem: function () {
      let newItem = {

      };
      this.$store.commit('pushNotificationsStore/setItem', newItem);
      this.$store.commit('pushNotificationsStore/setDialogForm', true);
    },
    editItem: function (item) {
      this.$store.dispatch('pushNotificationsStore/item', item);
      this.$store.commit('pushNotificationsStore/setDialogForm', true);
    },
    askSend: function (item) {
      this.sendingItem = { ...item };
      this.dialogConfirmSend = true;
    },
    confirmSend: function () {
      if (this.sending) {
        return;
      }
      this.sending = true;
      this.$store.dispatch('pushNotificationsStore/send', this.sendingItem.id).then(response => {
        this.dialogConfirmSend = false;
        this.$root.showSnackbar('Notification envoyée', 'success');
      }, error => {
        const errors = error?.response?.data?.errors;
        this.$root.showSnackbar(Array.isArray(errors) && errors.length
          ? errors.join('<br/>')
          : 'La notification n’a pas pu être envoyée', 'error');
      }).finally(() => {
        this.sending = false;
      });
    },
    refresh: function () {
      this.$store.dispatch('pushNotificationsStore/items');
    },
    tryDeleteItem: function (item) {
      this.deletingItem = { ...item };
      this.dialogConfirmDelete = true;
    },
    deleteItem: function (item) {
      this.$store.dispatch('pushNotificationsStore/delete', item.id).then(response => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar('Notification supprimée', 'success');
      });
    },
  },
  data() {
    return {
      deletingItem: {},
      sendingItem: {},
      sending: false,
      dialogConfirmSend: false,
      dialogConfirmDelete: false,
      loadingDelete: false,
      search: '',
      dialog: false,
      editedItem: {},
      valid: true,
      filter: {
        what: moment().year().toString(),
        name: null,
      },
      headers: [
        {
          title: 'Titre',
          key: 'title',
          sortable: true
        },
        {
          title: 'Actions',
          key: 'actions',
          sortable: false,
          align: 'end',
        },
      ],
    }
  },
  beforeMount: function () {
    this.$store.dispatch('pushNotificationsStore/items');
  },
}
</script>