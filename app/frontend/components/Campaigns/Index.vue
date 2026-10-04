<template>
  <div class="list-toolbar">
    <v-text-field density="compact" v-model="search" label="Rechercher une campagne" prepend-inner-icon="mdi-magnify"
      hide-details variant="outlined" clearable class="list-toolbar__search"></v-text-field>
    <v-btn icon="mdi-refresh" variant="text" color="primary" aria-label="Actualiser la liste" @click="refresh()"></v-btn>
    <v-spacer></v-spacer>
    <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="newItem()">
      Ajouter une campagne
    </v-btn>
  </div>
  <v-data-table :headers="headers" :items="filteredItems" :search="search" class="elevation-1" :loading="loading" hover>
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@3"></v-skeleton-loader>
    </template>
    <template v-slot:no-data>
      <div class="list-empty">
        <p class="text-subtitle-1 font-weight-medium mb-1">
          {{ search ? `Aucune campagne ne correspond à « ${search} »` : 'Aucune campagne de vote pour le moment' }}
        </p>
        <v-btn v-if="search" variant="text" color="primary" @click="search = ''">Effacer la recherche</v-btn>
        <v-btn v-else variant="tonal" color="primary" prepend-icon="mdi-plus" @click="newItem()">Ajouter une campagne</v-btn>
      </div>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.id }}</td>
        <td class="font-weight-medium">{{ item.name }}</td>
        <td>{{ item.structure_name }}</td>
        <td>
          <campaign-state-chip :state="item.state"></campaign-state-chip>
        </td>
        <td class="text-right text-no-wrap">
          <row-action v-if="item.state === 'coming'" icon="mdi-play-circle-outline" color="success"
            label="Ouvrir le vote" @click="changeCampaignState(item, 'opening')"></row-action>
          <row-action v-if="item.state === 'opened'" icon="mdi-pause-circle-outline" color="primary"
            label="Suspendre le vote (il pourra être rouvert)" @click="changeCampaignState(item, 'close_temporarily')"></row-action>
          <row-action v-if="item.state === 'opened'" icon="mdi-stop-circle-outline" color="error"
            label="Clôturer définitivement le vote" @click="askCloseForGood(item)"></row-action>
          <row-action icon="mdi-pencil" label="Modifier la campagne" @click="editItem(item)"></row-action>
          <row-action icon="mdi-delete-outline" color="error" label="Supprimer la campagne" @click="tryDeleteItem(item)"></row-action>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogForm" fullscreen>
    <campaign-form @refresh="refresh()"></campaign-form>
  </v-dialog>

  <v-dialog max-width="460" v-model="dialogConfirmClose">
    <v-card title="Clôturer définitivement le vote ?">
      <v-card-text>
        <strong>{{ closingItem.name }}</strong>
        <p class="mt-2">Plus personne ne pourra voter et la campagne ne pourra pas être rouverte.</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialogConfirmClose = false">Annuler</v-btn>
        <v-btn color="error" variant="flat" :loading="changingState"
          @click="changeCampaignState(closingItem, 'close_definitly')">Clôturer le vote</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog max-width="440" v-model="dialogConfirmDelete">
    <v-card title="Supprimer la campagne ?">
      <v-card-text>
        <strong>{{ deletingItem.name }}</strong>
        <p class="mt-2">La campagne et ses questions seront supprimées. Cette action est irréversible.</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialogConfirmDelete = false">Annuler</v-btn>
        <v-btn color="error" variant="flat" :loading="loadingDelete" @click="deleteItem(deletingItem)">Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import CampaignForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";
import RowAction from "../Tools/RowAction.vue";
import CampaignStateChip from "./StateChip.vue";

export default {
  name: "CampaignsIndex",
  components: {
    CampaignForm,
    DialogConfirm,
    RowAction,
    CampaignStateChip,
  },
  props: {
    domain: {
      type: String,
      default: 'me',
    },
  },
  computed: {
    ...mapGetters('campaignsStore', {
      items: 'getItems',
      loading: 'getLoading',
      referentiels: 'getReferentiels',
    }),
    dialogForm: {
      get() {
        return this.$store.state.campaignsStore.dialogForm;
      },
      set(value) {
        this.$store.commit('campaignsStore/setDialogForm', value);
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
        name: '',
        structure_id: null,
        motions: [],
        state: 'coming',
      };
      this.$store.commit('campaignsStore/setItem', newItem);
      this.$store.commit('campaignsStore/setDialogForm', true);
    },
    editItem: function (item) {
      this.$store.dispatch('campaignsStore/item', item.id);
      this.$store.commit('campaignsStore/setDialogForm', true);
    },
    refresh: function () {
      this.$store.dispatch('campaignsStore/items', { domain: this.domain });
    },
    tryDeleteItem: function (item) {
      this.deletingItem = { ...item };
      this.dialogConfirmDelete = true;
    },
    deleteItem: function (item) {
      this.loadingDelete = true;
      this.$store.dispatch('campaignsStore/delete', item.id).then(response => {
        this.refresh();
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar('Campagne supprimée', 'success');
      }, () => {
        this.$root.showSnackbar('La campagne n’a pas pu être supprimée.', 'error');
      }).finally(() => {
        this.loadingDelete = false;
      });
    },
    askCloseForGood: function (item) {
      this.closingItem = { ...item };
      this.dialogConfirmClose = true;
    },
    changeCampaignState: function (item, action) {
      this.changingState = true;
      this.$store.dispatch('campaignsStore/changeState', {
        id: item.id,
        state: action
      }).then(response => {
        this.refresh();
        this.dialogConfirmClose = false;
        this.$root.showSnackbar('Le statut de la campagne a été mis à jour', 'success');
      }, error => {
        const errors = error?.response?.data?.errors;
        this.$root.showSnackbar(Array.isArray(errors) && errors.length
          ? errors.join('<br/>')
          : 'Le statut de la campagne n’a pas pu être modifié', 'error');
      }).finally(() => {
        this.changingState = false;
      });
    },
  },
  data() {
    return {
      deletingItem: {},
      closingItem: {},
      changingState: false,
      dialogConfirmClose: false,
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
          title: 'ID',
          key: 'id',
          sortable: true
        },
        {
          title: 'Nom',
          key: 'name',
          sortable: true
        },
        {
          title: 'Association',
          key: 'structure_name',
          sortable: true
        },
        {
          title: 'Statut',
          key: 'state',
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
    this.refresh();
    this.$store.dispatch('campaignsStore/referentiels', { domain: this.domain });
  },
}
</script>

<style scoped></style>