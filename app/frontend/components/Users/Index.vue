<template>
  <v-row class="mb-0">
    <v-col cols="12" lg="3" md="3">
      <v-text-field
          density="compact"
          v-model="search"
          label="Chercher un utilisateur (Nom, Ville...)"
          hide-details
          variant="outlined"
          clearable
      ></v-text-field>
    </v-col>
    <v-col cols="12" lg="3" md="3">
      <v-select
          density="compact"
          v-model="filter.levels"
          :items="referentiels.levels"
          label="Reconnaissance"
          hide-details
          multiple
          clearable
          chips
          variant="outlined"
      ></v-select>
    </v-col>
    <v-col cols="12" lg="3" md="3">
      <v-btn-toggle v-model="filter.disabled" rounded style="height: 40px">
        <v-btn :value="false" color="success" class="py-1">
          Actif
        </v-btn>

        <v-btn :value="true" color="warning" class="py-1">
          Inactif
        </v-btn>
      </v-btn-toggle>
    </v-col>
    <v-col cols="12" lg="3" md="3" class="text-right">
      <v-btn color="white" class="me-3" @click="refresh()" icon size="small">
        <v-icon color="primary">mdi-reload</v-icon>
      </v-btn>
      <v-btn color="primary" class="ml-auto" @click="newItem()">
        <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
        Ajouter un utilisateur
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table
      :headers="headers"
      :items="filteredItems"
      :search="search"
      item-value="name"
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
              title="Aucun utilisateur trouvé"
              text="Aucun utilisateur ne correspond à votre recherche. Si vous pensez à une erreur, contactez le support."
          ></v-alert>
        </td>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.value.id }}</td>
        <td>
          <div class="d-flex align-center py-4">
            <div>
              <v-img
                  :src="'/avatars/' + item.value.id + '.png'"
                  width="45px"
                  class="rounded-circle img-fluid"
              ></v-img>
            </div>

            <div class="ml-5">
              <h4>{{ item.value.lastname }} {{ item.value.firstname }}</h4>
              <span class="subtitle-2 d-block font-weight-regular">{{
                  item.value.email
                }}</span>
            </div>
          </div>
        </td>
        <td>{{ item.value.zipcode }} {{ item.value.town }}</td>
        <td>
          <v-chip color="info" label>{{ item.value.current_level }}</v-chip>
        </td>
        <td>
          <v-tooltip location="top" text="Modifier l'utilisateur">
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

          <v-tooltip location="top" text="Supprimer l'utilisateur">
            <template v-slot:activator="{ props }">
              <v-icon
                  v-bind="props"
                  small
                  class="text-error"
                  title="Delete"
                  @click="tryDeleteItem(item.value)">
                mdi-delete
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Désactiver l'utilisateur" v-if="!item.value.disabled">
            <template v-slot:activator="{ props }">
              <v-icon
                  v-bind="props"
                  small
                  color="orange"
                  title="Désactiver"
                  @click="disableItem(item.value)">
                mdi-account-off
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Activer l'utilisateur" v-if="item.value.disabled">
            <template v-slot:activator="{ props }">
              <v-icon
                  v-bind="props"
                  small
                  color="green"
                  title="Activer"
                  @click="enableItem(item.value)">
                mdi-account-off
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Se connecter en tant que l'utilisateur">
            <template v-slot:activator="{ props }">
              <v-icon
                  v-bind="props"
                  small
                  color="danger"
                  title="Activer"
                  @click="connectAs(item.value)">
                mdi-drama-masks
              </v-icon>
            </template>
          </v-tooltip>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogForm" max-width="75%">
    <user-form></user-form>
  </v-dialog>
  <v-dialog max-width="25%" v-model="dialogConfirmDelete">
    <v-card>
      <v-card-text>
        Etes-vous sûr de vouloir supprimer cet utilisateur ?
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
import UserForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";

export default {
  name: "UsersIndex",
  components: {
    VDataTable,
    UserForm,
    DialogConfirm,
  },
  computed: {
    ...mapGetters('usersStore', {
      items: 'getItems',
      loading: 'getLoading',
      referentiels: 'getReferentiels',
    }),
    dialogForm: {
      get() {
        return this.$store.state.usersStore.dialogForm;
      },
      set(value) {
        this.$store.commit('usersStore/setDialogForm', value);
      },
    },
    filteredItems() {
      return this.items.filter(item => {
        if (this.filter.levels.length > 0 && !this.filter.levels.includes(item.current_level)) {
          return false;
        }

        if (this.filter.disabled && !item.disabled || !this.filter.disabled && item.disabled) {
          return false;
        }

        return true;
      });
    },
  },
  methods: {
    newItem: function () {
      let newItem = {
        user: {
          id: null,
          lastname: '',
          firstname: '',
          email: '',
          password: '',
          password_confirmation: '',
          zipcode: '',
          town: '',
          disabled: false,
        },
        gratitudes: [],
        fees: [],
        phases: [],
        responsabilites: [],
      };
      this.$store.commit('usersStore/setItem', newItem);
      this.$store.commit('usersStore/setDialogForm', true);
    },
    editItem: function (item) {
      this.$store.dispatch('usersStore/getItem', item.value.id);
      this.$store.commit('usersStore/setDialogForm', true);
    },
    enableItem: function (item) {
      this.$store.dispatch('usersStore/enable', item.id).then(response => {
        this.$root.showSnackbar('Utilisateur activé avec succès', 'success');
      });
    },
    disableItem: function (item) {
      this.$store.dispatch('usersStore/disable', item.id).then(response => {
        this.$root.showSnackbar('Utilisateur désactivé avec succès', 'success');
      });
    },
    refresh: function () {
      this.$store.dispatch('usersStore/items');
    },
    tryDeleteItem: function (item) {
      Object.assign(this.deletingItem, item);
      this.dialogConfirmDelete = true;
    },
    deleteItem: function (item) {
      this.$store.dispatch('usersStore/delete', item.id).then(response => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar('Utilisateur supprimé avec succès', 'success');
      });
    }
  },
  data() {
    return {
      deletingItem: {},
      dialogConfirmDelete: false,
      loadingDelete: false,
      search: '',
      formTitle: 'Ajouter un utilisateur',
      dialog: false,
      editedItem: {},
      valid: true,
      filter: {
        levels: [],
        disabled: false,
      },
      headers: [
        {title: 'ID', key: 'id', sortable: true},
        {title: 'Nom', key: 'lastname', sortable: true},
        {title: 'Ville', align: 'start', key: 'town', sortable: true},
        {title: 'Niveau', align: 'start', key: 'current_level', sortable: true},
        {title: 'Actions', key: 'actions', sortable: false},
      ],
    }
  },
  beforeMount: function () {
    this.$store.dispatch('usersStore/items');
    this.$store.dispatch('usersStore/referentiels');
  },
}
</script>

<style scoped>

</style>