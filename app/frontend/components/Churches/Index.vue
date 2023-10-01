<template>
  <v-row justify="space-between">
    <v-col cols="12" lg="4" md="4" class="mb-3">
      <v-text-field
          density="compact"
          v-model="search"
          label="Chercher une église (Nom, Ville...)"
          hide-details
          variant="outlined"
          clearable
      ></v-text-field>
    </v-col>
    <v-col cols="12" lg="2" md="2" class="text-right">
      <v-spacer></v-spacer>
      <v-btn color="white" class="me-3" @click="refresh()" icon size="small">
        <v-icon color="primary">mdi-reload</v-icon>
      </v-btn>
      <v-btn color="primary" class="ml-auto" @click="newItem()">
        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
        Ajouter une eglise
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
              title="Aucune église trouvée"
              text="Aucune église ne correspond à votre recherche. Si vous pensez à une erreur, contactez le support."
          ></v-alert>
        </td>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.id }}</td>
        <td>
          <div class="d-flex align-center py-4">
            <v-avatar
                :image="'/logos/' + item.id + '.png'"
            ></v-avatar>
            <div class="ml-5">
              <h4>{{ item.name }}</h4>
            </div>
          </div>
        </td>
        <th>{{ item.lastname }} {{ item.firstname }}</th>
        <td>{{ item.town }} <small>({{ item.zipcode }})</small></td>
        <td>
          <v-tooltip location="top" text="Modifier l'église">
            <template v-slot:activator="{ props }">
              <v-icon
                  small
                  v-bind="props"
                  color="primary"
                  @click="editItem(item)"
                  title="Edit">
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Supprimer l'église">
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
    <church-form></church-form>
  </v-dialog>
  <v-dialog  max-width="25%" v-model="dialogConfirmDelete">
    <v-card>
      <v-card-text>
        Etes-vous sûr de vouloir supprimer cette église ?
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
import ChurchForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";

export default {
  name: "ChurchesIndex",
  components: {
    VDataTable,
    ChurchForm,
    DialogConfirm,
  },
  computed: {
    ...mapGetters('churchesStore', {
      items: 'getItems',
      loading: 'getLoading',
      referentiels: 'getReferentiels',
    }),
    dialogForm: {
      get() {
        return this.$store.state.churchesStore.dialogForm;
      },
      set(value) {
        this.$store.commit('churchesStore/setDialogForm', value);
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
      };
      this.$store.commit('churchesStore/setItem', newItem);
      this.$store.commit('churchesStore/setDialogForm', true);
    },
    editItem: function (item) {
      this.$store.dispatch('churchesStore/item', item.id);
      this.$store.commit('churchesStore/setDialogForm', true);
    },
    refresh: function () {
      this.$store.dispatch('churchesStore/items');
    },
    tryDeleteItem: function (item) {
      Object.assign(this.deletingItem, item);
      this.dialogConfirmDelete = true;
    },
    deleteItem   : function (item) {
      this.$store.dispatch('churchesStore/delete', item.id).then(response => {
        this.dialogConfirmDelete = false;
        this.deletingItem        = {};
        this.$root.showSnackbar('Eglise supprimée avec succès', 'success');
      });
    }
  },
  data() {
    return {
      deletingItem       : {},
      dialogConfirmDelete: false,
      loadingDelete      : false,
      search: '',
      dialog: false,
      editedItem: {},
      valid: true,
      filter: {
        levels: [],
        disabled: false,
      },
      headers: [
        {title: 'ID', key: 'id', sortable: true},
        {title: 'Nom', key: 'name', sortable: true},
        {title: 'President', key: 'lastname', sortable: true},
        {title: 'Ville', align: 'start', key: 'town', sortable: true},
        {title: 'Actions', key: 'actions', sortable: false},
      ],
    }
  },
  beforeMount: function () {
    this.$store.dispatch('churchesStore/items');
    this.$store.dispatch('churchesStore/referentiels');
  },
}
</script>

<style scoped>

</style>