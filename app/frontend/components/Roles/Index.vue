<template>
  <v-row justify="space-between">
    <v-col cols="12" lg="4" md="4" class="mb-3">
      <v-text-field
          density="compact"
          v-model="search"
          label="Chercher un rôle..."
          hide-details
          variant="outlined"
          clearable
      ></v-text-field>
    </v-col>
    <v-col cols="12" lg="3" md="3" class="text-right">
      <v-spacer></v-spacer>
      <v-btn color="white" class="me-3" @click="refresh()" icon size="small">
        <v-icon color="primary">mdi-reload</v-icon>
      </v-btn>
      <v-btn color="primary" class="ml-auto" @click="newItem()">
        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
        Ajouter un rôle
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table
      :headers="headers"
      :items="filteredItems"
      :search="search"
      class="elevation-1"
      :loading="loading"
  >
    <template v-slot:no-data>
      <tr>
        <td colspan="5">
          <v-progress-linear
              indeterminate
              color="cyan"
              v-if="loading"
          ></v-progress-linear>
          <v-alert
              v-else
              color="danger"
              icon="danger"
              title="Aucun rôle n'a été trouvée"
              text="Aucun rôle ne correspond à votre recherche. Si vous pensez à une erreur, contactez le support."
          ></v-alert>
        </td>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.friendly_name }}</td>
        <td><code class="text-grey">{{ item.name }}</code></td>
        <td>
          <v-tooltip location="top" text="Modifier l'actu">
            <template v-slot:activator="{ props }">
              <v-icon
                  small
                  v-bind="props"
                  color="primary"
                  @click="editItem(item.id)"
                  title="Edit">
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Supprimer l'actu">
            <template v-slot:activator="{ props }">
              <v-icon
                  v-bind="props"
                  small
                  class="text-error"
                  title="Delete"
                  @click="tryDeleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-tooltip>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogForm" max-width="75%">
    <role-form></role-form>
  </v-dialog>
  <v-dialog max-width="25%" v-model="dialogConfirmDelete">
    <v-card>
      <v-card-text>
        Etes-vous sûr de vouloir supprimer ce rôle ?
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
import {mapGetters} from "vuex";
import {VDataTable} from 'vuetify/labs/VDataTable';
import RoleForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";

export default {
  name:       "rolesIndex",
  components: {
    VDataTable,
    RoleForm,
    DialogConfirm,
  },
  computed:   {
    ...mapGetters('rolesStore', {
      items:   'getItems',
      loading: 'getLoading',
    }),
    dialogForm: {
      get() {
        return this.$store.state.rolesStore.dialogForm;
      },
      set(value) {
        this.$store.commit('rolesStore/setDialogForm', value);
      },
    },
    filteredItems() {
      return this.items.filter(item => {
        return true;
      });
    },
  },
  methods:    {
    newItem:       function () {
      let newItem = {
        id:       null,
        title:    '',
        content:  '',
        accesses: [],
      };
      this.$store.commit('rolesStore/setItem', newItem);
      this.$store.commit('rolesStore/setDialogForm', true);
    },
    editItem:      function (item) {
      this.$store.dispatch('rolesStore/item', item);
      this.$store.commit('rolesStore/setDialogForm', true);
    },
    refresh:       function () {
      this.$store.dispatch('rolesStore/items');
    },
    tryDeleteItem: function (item) {
      Object.assign(this.deletingItem, item);
      this.dialogConfirmDelete = true;
    },
    deleteItem:    function (item) {
      this.$store.dispatch('rolesStore/delete', item.value).then(response => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar('Rôle supprimé avec succès', 'success');
      });
    },
  },
  data() {
    return {
      deletingItem:        {},
      dialogConfirmDelete: false,
      loadingDelete:       false,
      search:              '',
      dialog:              false,
      editedItem:          {},
      valid:               true,
      filter:              {
        levels:   [],
        disabled: false,
      },
      headers:             [
        {
          title:    'Nom',
          key:      'friendly_name',
          sortable: true
        },
        {
          title:    'Slug',
          key:      'name',
          sortable: true
        },
        {
          title:    'Actions',
          key:      'actions',
          sortable: false
        },
      ],
    }
  },
  beforeMount: function () {
    this.$store.dispatch('rolesStore/items');
  },
}
</script>

<style scoped>

</style>