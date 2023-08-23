<template>
  <v-row justify="space-between">
    <v-col cols="12" lg="6" md="6" class="mb-3">
      <v-text-field
          density="compact"
          v-model="search"
          label="Chercher une campagne (Nom...)"
          hide-details
          variant="outlined"
          clearable
      ></v-text-field>
    </v-col>
    <v-col cols="12" lg="6" md="6" class="text-right">
      <v-spacer></v-spacer>
      <v-btn color="white" class="me-3" @click="refresh()" icon size="small">
        <v-icon color="primary">mdi-reload</v-icon>
      </v-btn>
      <v-btn color="primary" class="ml-auto" @click="newItem()">
        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
        Ajouter une campagne
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table
      :headers="headers"
      :items="filteredItems"
      :search="search"
      class="elevation-1"
      loading="loading"
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
              title="Aucune église trouvée"
              text="Aucune campagne ne correspond à votre recherche. Si vous pensez à une erreur, contactez le support."
          ></v-alert>
        </td>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.props.title.id }}</td>
        <td>{{ item.props.title.name }}</td>
        <td>
          <v-chip :color="getColor(item.props.title.state)">
            {{ getState(item.props.title.state) }}
          </v-chip>
        </td>
        <td>
          <v-tooltip location="top" text="Modifier la campagne">
            <template v-slot:activator="{ props }">
              <v-icon
                  small
                  v-bind="props"
                  color="primary"
                  @click="editItem(item.props.title)"
                  title="Edit">
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Supprimer la campagne">
            <template v-slot:activator="{ props }">
              <v-icon
                  v-bind="props"
                  small
                  class="text-error"
                  title="Delete"
                  @click="tryDeleteItem(item.props.title)">
                mdi-delete
              </v-icon>
            </template>
          </v-tooltip>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogForm" fullscreen>
    <campaign-form></campaign-form>
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
import {mapGetters} from "vuex";
import {VDataTable} from 'vuetify/labs/VDataTable'
import CampaignForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";

export default {
  name      : "CampaignsIndex",
  components: {
    VDataTable,
    CampaignForm,
    DialogConfirm,
  },
  computed  : {
    ...mapGetters('campaignsStore', {
      items       : 'getItems',
      loading     : 'getLoading',
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
  methods   : {
    newItem      : function () {
      let newItem = {
        name        : '',
        structure_id: null,
        motions     : [],
      };
      this.$store.commit('campaignsStore/setItem', newItem);
      this.$store.commit('campaignsStore/setDialogForm', true);
    },
    editItem     : function (item) {
      this.$store.dispatch('campaignsStore/item', item.id);
      this.$store.commit('campaignsStore/setDialogForm', true);
    },
    refresh      : function () {
      this.$store.dispatch('campaignsStore/items');
    },
    tryDeleteItem: function (item) {
      Object.assign(this.deletingItem, item);
      this.dialogConfirmDelete = true;
    },
    deleteItem   : function (item) {
      this.$store.dispatch('campaignsStore/delete', item.id).then(response => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar('Campagne supprimée avec succès', 'success');
      });
    },
    getState     : function (state) {
      switch (state) {
        case 'closed':
          return 'Fermée';
        case 'opened':
          return 'Ouverte';
        case 'comming':
          return 'A venir';
      }
    },
    getColor     : function (state) {
      switch (state) {
        case 'closed':
          return 'red';
        case 'opened':
          return 'green';
        case 'comming':
          return 'orange';
      }
    },
  },
  data() {
    return {
      deletingItem       : {},
      dialogConfirmDelete: false,
      loadingDelete      : false,
      search             : '',
      dialog             : false,
      editedItem         : {},
      valid              : true,
      filter             : {
        levels  : [],
        disabled: false,
      },
      headers            : [
        {title    : 'ID',
          key     : 'id',
          sortable: true
        },
        {title    : 'Nom',
          key     : 'name',
          sortable: true
        },
        {title    : 'Status',
          key     : 'state',
          sortable: true
        },
        {title    : 'Actions',
          key     : 'actions',
          sortable: false
        },
      ],
    }
  },
  beforeMount: function () {
    this.$store.dispatch('campaignsStore/items');
    this.$store.dispatch('campaignsStore/referentiels');
  },
}
</script>

<style scoped>

</style>