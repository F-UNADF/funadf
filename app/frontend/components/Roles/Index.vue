<template>
  <div class="list-toolbar">
    <v-text-field density="compact" v-model="search" label="Rechercher un rôle" prepend-inner-icon="mdi-magnify"
      hide-details variant="outlined" clearable class="list-toolbar__search"></v-text-field>
    <v-btn icon="mdi-refresh" variant="text" color="primary" aria-label="Actualiser la liste" @click="refresh()"></v-btn>
    <v-spacer></v-spacer>
    <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="newItem()">
      Ajouter un rôle
    </v-btn>
  </div>
  <v-data-table
      :headers="headers"
      :items="filteredItems"
      :search="search"
      class="elevation-1"
      :loading="loading"
  >
    <template v-slot:no-data>
      <div class="list-empty">
        <p class="text-subtitle-1 font-weight-medium mb-1">
          {{ search ? `Aucun rôle ne correspond à « ${search} »` : 'Aucun rôle pour le moment' }}
        </p>
        <v-btn v-if="search" variant="text" color="primary" @click="search = ''">Effacer la recherche</v-btn>
        <v-btn v-else variant="tonal" color="primary" prepend-icon="mdi-plus" @click="newItem()">Ajouter un rôle</v-btn>
      </div>
    </template>
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@3"></v-skeleton-loader>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td class="font-weight-medium">{{ item.friendly_name || item.name }}</td>
        <td><code class="text-grey">{{ item.name }}</code></td>
        <td class="text-right text-no-wrap">
          <row-action icon="mdi-pencil" color="primary" label="Modifier le rôle" @click="editItem(item.id)"></row-action>

          <row-action icon="mdi-delete-outline" color="error" label="Supprimer le rôle" @click="tryDeleteItem(item)"></row-action>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogForm" max-width="960">
    <role-form></role-form>
  </v-dialog>
  <v-dialog max-width="440" v-model="dialogConfirmDelete">
    <v-card title="Supprimer le rôle ?">
      <v-card-text><strong>{{ deletingItem.friendly_name || deletingItem.name }}</strong><p class="mt-2">Les personnes qui ont ce rôle le perdront. Cette action est irréversible.</p></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialogConfirmDelete = false">Annuler</v-btn>
        <v-btn color="error" variant="flat" @click="deleteItem(deletingItem)">Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from "vuex";
import RoleForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";
import RowAction from "../Tools/RowAction.vue";

export default {
  name:       "rolesIndex",
  components: {
    RowAction,
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
      this.deletingItem = { ...item };
      this.dialogConfirmDelete = true;
    },
    deleteItem:    function (item) {
      this.$store.dispatch('rolesStore/delete', item.id).then(response => {
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
      search:              '',
      dialog:              false,
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
          title:    'Identifiant technique',
          key:      'name',
          sortable: true
        },
        {
          title:    'Actions',
          key:      'actions',
          sortable: false,
          align: 'end'
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