<template>
  <v-toolbar flat color="transparent" class="mb-3">
    <v-text-field density="compact" v-model="search" label="Chercher une campagne (Nom...)" hide-details
      variant="outlined" clearable></v-text-field>

    <v-spacer></v-spacer>
    <v-btn color="white" class="me-3" @click="refresh()" icon>
      <v-icon color="primary">mdi-reload</v-icon>
    </v-btn>
    <v-btn color="primary" variant='flat' class="ml-auto" @click="newItem()">
      <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
      Ajouter une campagne
    </v-btn>
  </v-toolbar>
  <v-data-table :headers="headers" :items="filteredItems" :search="search" class="elevation-1" :loading="loading">
    <template v-slot:no-data>
      <v-progress-linear indeterminate color="cyan" v-if="loading"></v-progress-linear>
      <v-alert v-else color="danger" icon="danger" title="Aucune campagne trouvée"
        text="Aucune campagne ne correspond à votre recherche. Si vous pensez à une erreur, contactez le support."></v-alert>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.structure_name }}</td>
        <td>
          <v-chip :color="getColor(item.state)">
            {{ getState(item.state) }}
          </v-chip>
        </td>
        <td>
          <v-tooltip location="top" text="Fermer la campagne">
            <template v-slot:activator="{ props }">
              <v-icon small v-bind="props" color="green" v-if="item.state === 'opened'"
                @click="changeCampaignState(item.id, 'close_temporarily')">
                mdi-eye-off
              </v-icon>
            </template>
          </v-tooltip>
          <v-tooltip location="top" text="Ouvrir la campagne">
            <template v-slot:activator="{ props }">
              <v-icon small v-bind="props" color="success" v-if="item.state === 'coming'"
                @click="changeCampaignState(item.id, 'opening')">
                mdi-check
              </v-icon>
            </template>
          </v-tooltip>
          <v-tooltip location="top" text="Cloturer la campagne - La campagne ne pourra pas être réouverte.">
            <template v-slot:activator="{ props }">
              <v-icon small v-bind="props" color="danger" v-if="item.state === 'opened'"
                @click="changeCampaignState(item.id, 'close_definitly')">
                mdi-close
              </v-icon>
            </template>
          </v-tooltip>
        </td>
        <td>
          <v-tooltip location="top" text="Modifier la campagne">
            <template v-slot:activator="{ props }">
              <v-icon small v-bind="props" color="primary" @click="editItem(item)" title="Edit">
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Supprimer la campagne">
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
    <campaign-form @refresh="refresh()"></campaign-form>
  </v-dialog>
  <v-dialog max-width="25%" v-model="dialogConfirmDelete">
    <v-card>
      <v-card-text>
        Etes-vous sûr de vouloir supprimer cette campagne ?
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
import CampaignForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";

export default {
  name: "CampaignsIndex",
  components: {
    CampaignForm,
    DialogConfirm,
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
      Object.assign(this.deletingItem, item);
      this.dialogConfirmDelete = true;
    },
    deleteItem: function (item) {
      this.$store.dispatch('campaignsStore/delete', item.id).then(response => {
        this.refresh();
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar('Campagne supprimée avec succès', 'success');
      });
    },
    getState: function (state) {
      switch (state) {
        case 'closed':
          return 'Fermée';
        case 'opened':
          return 'Ouverte';
        case 'coming':
          return 'A venir';
      }
    },
    getColor: function (state) {
      switch (state) {
        case 'closed':
          return 'red';
        case 'opened':
          return 'green';
        case 'coming':
          return 'orange';
      }
    },
    changeCampaignState: function (id, action) {
      this.$store.dispatch('campaignsStore/changeState', {
        id: id,
        state: action
      }).then(response => {
        this.refresh();
        this.$root.showSnackbar('Le Statut de la campagne a bien été changé', 'success');
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de la campagne', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
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
          title: 'Status',
          key: 'state',
          sortable: true
        },
        {
          title: '',
          key: '',
          sortable: false
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
    this.refresh();
    this.$store.dispatch('campaignsStore/referentiels', { domain: this.domain });
  },
}
</script>

<style scoped></style>