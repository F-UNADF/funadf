<template>
  <v-row justify="space-between">
    <v-col cols="12" lg="4" md="4" class="mb-3">
      <!-- Filter by What (list of YEAR from 2017 to current year)-->
      <v-select v-model="filter.what" :items="years" label="Année" hide-details></v-select>
    </v-col>
    <v-col cols="12" lg="4" md="4" class="mb-3">
      <!-- Filter by user lastname -->
      <v-text-field v-model="filter.lastname" label="Nom" hide-details></v-text-field>
    </v-col>
    <v-col cols="12" lg="3" md="3" class="text-right">
      <v-spacer></v-spacer>
      <v-btn color="white" class="me-3" @click="refresh()" icon size="small">
        <v-icon color="primary">mdi-reload</v-icon>
      </v-btn>
      <v-btn color="primary" class="ml-auto" @click="newItem()">
        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
        Ajouter une cotisation
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table :headers="headers" :items="filteredItems" :search="search" class="elevation-1" :loading="loading">
    <template v-slot:no-data>
      <tr>
        <td colspan="5">
          <v-progress-linear indeterminate color="cyan" v-if="loading"></v-progress-linear>
          <v-alert v-else color="danger" icon="danger" title="Aucune actu trouvée"
            text="Aucune cotisation ne correspond à votre recherche. Si vous pensez à une erreur, contactez le support."></v-alert>
        </td>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.what }}</td>
        <td>{{ item.user.lastname }} {{ item.user.firstname }}</td>
        <td>
          {{ formatedDevise(item.amount) }} €
        </td>
        <td>
          <v-tooltip location="top" text="Modifier l'actu">
            <template v-slot:activator="{ props }">
              <v-icon small v-bind="props" color="primary" @click="editItem(item.id)" title="Edit">
                mdi-pencil
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Supprimer l'actu">
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
    <post-form></post-form>
  </v-dialog>
  <v-dialog max-width="25%" v-model="dialogConfirmDelete">
    <v-card>
      <v-card-text>
        Etes-vous sûr de vouloir supprimer cette cotisation ?
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
import { VDataTable } from 'vuetify/labs/VDataTable'
import FeeForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";
import moment from "moment";

export default {
  name: "FeesIndex",
  components: {
    VDataTable,
    FeeForm,
    DialogConfirm,
  },
  computed: {
    ...mapGetters('feesStore', {
      items: 'getItems',
      loading: 'getLoading',
    }),
    dialogForm: {
      get() {
        return this.$store.state.feesStore.dialogForm;
      },
      set(value) {
        this.$store.commit('feesStore/setDialogForm', value);
      },
    },
    filteredItems() {
      return this.items.filter(item => {
        if (this.filter.what !== null && this.filter.what !== item.what) {
          return false;
        }
        if (this.filter.lastname !== null &&
          !item.user.lastname.toLowerCase().includes(this.filter.lastname.toLowerCase())) {
          return false;
        }
        return true;
      });
    },
    years() {
      let years = [null];
      let currentYear = moment().year() + 1;
      for (let i = currentYear; i >= 2017; i--) {
        years.push(i.toString());
      }
      return years;
    },
  },
  methods: {
    formatedDevise: function (amount) {
      return new Intl.NumberFormat('fr-FR').format(amount);
    },
    newItem: function () {
      let newItem = {
        id: null,
        title: '',
        content: '',
        accesses: [],
      };
      this.$store.commit('feesStore/setItem', newItem);
      this.$store.commit('feesStore/setDialogForm', true);
    },
    editItem: function (item) {
      this.$store.dispatch('feesStore/item', item);
      this.$store.commit('feesStore/setDialogForm', true);
    },
    refresh: function () {
      this.$store.dispatch('feesStore/items');
    },
    tryDeleteItem: function (item) {
      Object.assign(this.deletingItem, item);
      this.dialogConfirmDelete = true;
    },
    deleteItem: function (item) {
      this.$store.dispatch('feesStore/delete', item.id).then(response => {
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
        lastname: null,
      },
      headers: [
        {
          title: 'Année',
          key: 'what',
          sortable: true
        },
        {
          title: 'Qui',
          key: 'user.lastname',
          sortable: true
        },
        {
          title: 'Combien',
          key: 'amount',
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
    this.$store.dispatch('feesStore/items');
  },
}
</script>

<style scoped></style>