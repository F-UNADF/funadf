<template>
  <v-card flat class="mb-3">
    <v-card-text class="pa-0">
      <v-row class="ma-0" dense>
        <v-col cols="12" md="4">
          <v-text-field
              v-model="search"
              density="compact"
              label="Chercher un utilisateur (Nom, Ville...)"
              hide-details
              variant="outlined"
              clearable
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select
              v-model="filter.levels"
              :items="referentiels.levels"
              density="compact"
              label="Reconnaissance"
              hide-details
              multiple
              clearable
              chips
              variant="outlined"
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select
              v-model="filter.roles"
              :items="referentiels.roles"
              density="compact"
              label="Rôle global"
              hide-details
              multiple
              clearable
              chips
              variant="outlined"
          />
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-btn-toggle
              v-model="filter.disabled"
              rounded
              divided
              class="w-100"
              style="height: 40px"
          >
            <v-btn :value="false" color="success" class="flex-grow-1">
              Actif
            </v-btn>
            <v-btn :value="true" color="red" class="flex-grow-1">
              Inactif
            </v-btn>
          </v-btn-toggle>
        </v-col>

        <v-col cols="12">
          <div class="d-flex flex-wrap ga-2 align-center">
            <download
                :headers="downloadHeaders"
                :data="filteredItems"
                :name="downloadName"
            />

            <v-btn icon="mdi-refresh" variant="text" color="primary" aria-label="Actualiser la liste" @click="refresh()"></v-btn>

            <v-spacer />

            <v-btn color="primary" variant="flat" prepend-icon="mdi-account-plus" @click="newItem()">
              Ajouter un utilisateur
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-data-table :headers="headers" :items="filteredItems" item-value="name" class="elevation-1" :loading="loading">
    <template v-slot:no-data>
      <tr>
        <td colspan="5">
          <v-skeleton-loader v-if="loading" type="table-row@3"></v-skeleton-loader>
          <div v-else class="list-empty">
            <p class="text-subtitle-1 font-weight-medium mb-1">Aucun utilisateur ne correspond à ces critères</p>
            <p class="text-body-2 text-medium-emphasis">Modifiez la recherche ou les filtres ci-dessus.</p>
          </div>
        </td>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.id }}</td>
        <td>
          <div class="d-flex align-center py-4">
            <div>
              <v-avatar size="44" color="grayLighter">
                <v-img :src="'/avatars/' + item.id + '.png'" alt="" cover></v-img>
              </v-avatar>
            </div>

            <div class="ml-5">
              <div class="font-weight-bold">{{ item.lastname }} {{ item.firstname }}</div>
              <span class="text-body-2">{{ item.email }}</span>
              <v-chip v-if="item.invitation_accepted_at === null" size="x-small" variant="outlined" class="ml-2">
                Invitation en attente
              </v-chip>
            </div>
          </div>
        </td>
        <td>{{ item.zipcode }} {{ item.town }}</td>
        <td>
          <v-chip v-if="item.current_level" size="small" variant="tonal" color="primary" label>{{ item.current_level }}</v-chip>
          <span v-else class="text-medium-emphasis">Non renseigné</span>
        </td>
        <td class="text-right text-no-wrap">
          <v-tooltip location="top" text="Modifier l'utilisateur">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" color="primary" variant="text" size="small" icon="mdi-pencil" @click="editItem(item)"
                :aria-label="`Modifier ${item.firstname} ${item.lastname}`"></v-btn>
            </template>
          </v-tooltip>

          <v-tooltip location="top" text="Se connecter en tant que l'utilisateur">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" color="primary" variant="text" size="small" icon="mdi-account-switch-outline"
                @click="connectAs(item)" :aria-label="`Se connecter en tant que ${item.firstname} ${item.lastname}`"></v-btn>
            </template>
          </v-tooltip>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogForm" fullscreen>
    <user-form @refresh="refresh()"></user-form>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import UserForm from "./Form.vue";
import DialogConfirm from "../Tools/DialogConfirm.vue";
import Download from "@/components/Tools/Download.vue";

export default {
  name: "UsersIndex",
  props: {
    domain: {
      type: String,
      default: 'me',
    },
  },
  components: {
    Download,
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
      this.$store.dispatch('usersStore/getItem', item.id);
      this.$store.commit('usersStore/setDialogForm', true);
    },
    refresh: function () {
      this.$store.dispatch('usersStore/fetchItems', { domain: this.domain });
    },
    connectAs: function (user) {
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
      search: '',
      formTitle: 'Ajouter un utilisateur',
      dialog: false,
      editedItem: {},
      valid: true,
      filter: {
        levels: [],
        disabled: false,
        roles: [],
      },
      headers: [
        {
          title: 'ID',
          key: 'user.id',
          sortable: true
        },
        {
          title: 'Nom',
          key: 'user.lastname',
          sortable: true
        },
        {
          title: 'Ville',
          align: 'start',
          key: 'user.town',
          sortable: true
        },
        {
          title: 'Niveau',
          align: 'start',
          key: 'user.current_level',
          sortable: true
        },
        {
          title: 'Actions',
          key: 'actions',
          sortable: false,
          align: 'end',
        },
      ],
      downloadHeaders: [
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
    this.refresh();
    this.$store.dispatch('usersStore/referentiels');
  },
}
</script>

<style scoped></style>