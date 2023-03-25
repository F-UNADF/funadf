<template>
    <v-row>
      <v-col cols="12" lg="4" md="4" class="mb-3">
        <v-text-field
            density="compact"
            v-model="search"
            label="Chercher un utilisateur (Nom, Prénom, Email, Ville...)"
            hide-details
            variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" lg="4" md="4" class="mb-3">
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
      <v-col cols="12" lg="4" md="4" class="text-right">
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
                      :src="item.value.avatar_url"
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
                      @click="deleteItem(item.value)">
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
                      @click="enableItem(item.value)">
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
</template>

<script>
import {mapGetters} from "vuex";
import {VDataTable} from 'vuetify/labs/VDataTable'
import UserForm from "./Form.vue";

export default {
  name: "UsersIndex",
  components: {
    VDataTable,
    UserForm,
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
    deleteItem: function (item) {
      console.log(item);
    },
    enableItem: function (item) {
      console.log(item);
    },
    disableItem: function (item) {
      console.log(item);
    },
    refresh: function () {
      this.$store.dispatch('usersStore/items');
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