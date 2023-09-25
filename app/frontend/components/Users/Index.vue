<template>
  <v-row class="mb-0">
    <v-col cols="12" lg="2" md="2">
      <v-text-field
          density="compact"
          v-model="search"
          label="Chercher un utilisateur (Nom, Ville...)"
          hide-details
          variant="outlined"
          clearable
      ></v-text-field>
    </v-col>
    <v-col cols="12" lg="2" md="2">
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
    <v-col cols="12" lg="2" md="2">
      <v-select
          density="compact"
          v-model="filter.roles"
          :items="referentiels.roles"
          label="Rôle global"
          hide-details
          multiple
          clearable
          chips
          variant="outlined"
      ></v-select>
    </v-col>
    <v-col cols="12" lg="2" md="3">
      <v-btn-toggle v-model="filter.disabled" rounded style="height: 40px">
        <v-btn :value="false" color="success" class="py-1">
          Actif
        </v-btn>

        <v-btn :value="true" color="warning" class="py-1">
          Inactif
        </v-btn>
      </v-btn-toggle>
    </v-col>
    <v-col cols="12" lg="4" md="3" class="text-right">
      <download :headers="downloadHeaders" :data="this.filteredItems" :name="downloadName"></download>
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
      item-value="name"
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
              title="Aucun utilisateur trouvé"
              text="Aucun utilisateur ne correspond à votre recherche. Si vous pensez à une erreur, contactez le support."
          ></v-alert>
        </td>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.id }}</td>
        <td>
          <div class="d-flex align-center py-4">
            <div>
              <v-img
                  :src="'/avatars/' + item.id + '.png'"
                  width="45px"
                  class="rounded-circle img-fluid"
              ></v-img>
            </div>

            <div class="ml-5">
              <h4>{{ item.lastname }} {{ item.firstname }}</h4>
              <span class="subtitle-2 d-block font-weight-regular">{{
                  item.email
                }}</span>
            </div>
          </div>
        </td>
        <td>{{ item.zipcode }} {{ item.town }}</td>
        <td>
          <v-chip color="info" label>{{ item.current_level }}</v-chip>
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
                  @click="tryDeleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Désactiver l'utilisateur" v-if="!item.disabled">
            <template v-slot:activator="{ props }">
              <v-icon
                  v-bind="props"
                  small
                  color="orange"
                  title="Désactiver"
                  @click="disableItem(item)">
                mdi-account-off
              </v-icon>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Activer l'utilisateur" v-if="item.disabled">
            <template v-slot:activator="{ props }">
              <v-icon
                  v-bind="props"
                  small
                  color="green"
                  title="Activer"
                  @click="enableItem(item)">
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
                  @click="connectAs(item)">
                mdi-drama-masks
              </v-icon>
            </template>
          </v-tooltip>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogForm" fullscreen>
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
import Download from "@/components/Tools/Download.vue";

export default {
  name      : "UsersIndex",
  components: {
    Download,
    VDataTable,
    UserForm,
    DialogConfirm,
  },
  computed  : {
    ...mapGetters('usersStore', {
      items       : 'getItems',
      loading     : 'getLoading',
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

        if (this.filter.roles.length > 0) {
          if (item.roles) {
            let found = item.roles.split(',').some(role => this.filter.roles.includes(role));
            if (!found) {
              return false;
            }
          } else {
            return false;
          }
        }

        // Check if "search" is in the item lastname, firstname, town or zipcode
        return !(this.search &&
            (!item.lastname || !item.lastname.toLowerCase().includes(this.search.toLowerCase())) &&
            (!item.firstname || !item.firstname.toLowerCase().includes(this.search.toLowerCase())) &&
            (!item.town || !item.town.toLowerCase().includes(this.search.toLowerCase())) &&
            (!item.zipcode || !item.zipcode.toLowerCase().includes(this.search.toLowerCase())));
      });
    },
  },
  methods   : {
    newItem      : function () {
      let newItem = {
        user           : {
          id                   : null,
          lastname             : '',
          firstname            : '',
          email                : '',
          password             : '',
          password_confirmation: '',
          zipcode              : '',
          town                 : '',
          disabled             : false,
        },
        gratitudes     : [],
        fees           : [],
        phases         : [],
        responsabilites: [],
      };
      this.$store.commit('usersStore/setItem', newItem);
      this.$store.commit('usersStore/setDialogForm', true);
    },
    editItem     : function (item) {
      this.$store.dispatch('usersStore/getItem', item.id);
      this.$store.commit('usersStore/setDialogForm', true);
    },
    enableItem   : function (item) {
      this.$store.dispatch('usersStore/enable', item.id).then(response => {
        this.$root.showSnackbar('Utilisateur activé avec succès', 'success');
      });
    },
    disableItem  : function (item) {
      this.$store.dispatch('usersStore/disable', item.id).then(response => {
        this.$root.showSnackbar('Utilisateur désactivé avec succès', 'success');
      });
    },
    refresh      : function () {
      this.$store.dispatch('usersStore/items');
    },
    tryDeleteItem: function (item) {
      Object.assign(this.deletingItem, item);
      this.dialogConfirmDelete = true;
    },
    deleteItem   : function (item) {
      this.$store.dispatch('usersStore/delete', item.id).then(response => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar('Utilisateur supprimé avec succès', 'success');
      });
    },
    connectAs    : function (user) {
      console.log(user);
      this.$store.dispatch('sessionStore/switch_to', user.id).then(response => {
            this.$root.showSnackbar('Vous êtes maintenant connecté en tant que ' + user.lastname, 'success');
          },
          error => {
            this.$root.showSnackbar('Une erreur est survenue', 'error');
          });
    },
  },
  data() {
    return {
      deletingItem       : {},
      dialogConfirmDelete: false,
      loadingDelete      : false,
      search             : '',
      formTitle          : 'Ajouter un utilisateur',
      dialog             : false,
      editedItem         : {},
      valid              : true,
      filter             : {
        levels  : [],
        disabled: false,
        roles   : [],
      },
      headers            : [
        {
          title   : 'ID',
          key     : 'user.id',
          sortable: true
        },
        {
          title   : 'Nom',
          key     : 'user.lastname',
          sortable: true
        },
        {
          title   : 'Ville',
          align   : 'start',
          key     : 'user.town',
          sortable: true
        },
        {
          title   : 'Niveau',
          align   : 'start',
          key     : 'user.current_level',
          sortable: true
        },
        {
          title   : 'Actions',
          key     : 'actions',
          sortable: false
        },
      ],
      downloadHeaders    : [
        {
          title: 'ID',
          field: 'id'
        },
        {
          title: 'NOM',
          field: 'lastname'
        },
        {
          title: 'PRENOM',
          field: 'firstname'
        },
        {
          title: 'EMAIL',
          field: 'email'
        },
        {
          title: 'VILLE',
          field: 'town'
        },
        {
          title: 'CODE POSTAL',
          field: 'zipcode'
        },
        {
          title: 'NIVEAU',
          field: 'current_level'
        },
      ],
      // Nom au format YYYY-MM-DD_pasteurs.csv
      downloadName: 'utilisateurs_' + new Date().toISOString().slice(0, 10) + '.csv',
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