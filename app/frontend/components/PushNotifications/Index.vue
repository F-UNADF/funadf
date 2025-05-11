<template>
  <v-row class="mb-3 text-right" justify="end">
    <v-col>
      <v-spacer></v-spacer>
      <v-btn color="white" class="me-3" @click="refresh()" icon size="small">
        <v-icon color="primary">mdi-reload</v-icon>
      </v-btn>
      <v-btn color="primary" class="ml-auto" @click="newItem()">
        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
        Ajouter une notification
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table :headers="headers" :items="filteredItems" :search="search" class="elevation-1" :loading="loading">
    <template v-slot:no-data>
      <tr>
        <td colspan="5">
          <v-progress-linear indeterminate color="cyan" v-if="loading"></v-progress-linear>
          <v-alert v-else color="danger" icon="danger" title="Aucune notification trouvée"
            text="Aucune notification ne correspond à votre recherche. Si vous pensez à une erreur, contactez le support."></v-alert>
        </td>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>
          {{ item.title }}
          <small>{{ item.body }}</small>
        </td>
        <td>

          <v-tooltip location="top" text="Envoyer la notification">
            <template v-slot:activator="{ props }">
              <v-icon small v-bind="props" color="success" @click="sendItem(item.id)" title="Edit">
                mdi-send
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Modifier la notification">
            <template v-slot:activator="{ props }">
              <v-icon small v-bind="props" color="primary" @click="editItem(item.id)" title="Edit">
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Supprimer la notification">
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

  <v-dialog max-width="40%" v-model="dialogForm">
    <push-notification-form></push-notification-form>
  </v-dialog>
  <v-dialog max-width="25%" v-model="dialogConfirmDelete">
    <v-card>
      <v-card-text>
        Etes-vous sûr de vouloir supprimer cette notification ?
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
import PushNotificationForm from './Form.vue';
import DialogConfirm from "../Tools/DialogConfirm.vue";
import moment from "moment";

export default {
  name: "PushNotificationsIndex",
  components: {
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
    sendItem: function (item) {
      this.$store.dispatch('pushNotificationsStore/send', item).then(response => {
        this.$root.showSnackbar('Notification envoyée avec succès', 'success');
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'envoi de la notification', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    refresh: function () {
      this.$store.dispatch('pushNotificationsStore/items');
    },
    tryDeleteItem: function (item) {
      Object.assign(this.deletingItem, item);
      this.dialogConfirmDelete = true;
    },
    deleteItem: function (item) {
      this.$store.dispatch('pushNotificationsStore/delete', item.id).then(response => {
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
          sortable: false
        },
      ],
    }
  },
  beforeMount: function () {
    this.$store.dispatch('pushNotificationsStore/items');
  },
}
</script>