<template>
  <v-card>
    <v-card-text class="pa-5">
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
          <v-dialog v-model="dialog">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props" class="ml-auto">
                <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
                Ajouter un utilisateur
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            v-model="editedItem.id"
                            label="Id"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            v-model="editedItem.userinfo"
                            label="User info"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            v-model="editedItem.usermail"
                            label="User email"
                            type="email"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            v-model="editedItem.phone"
                            label="Phone"
                            type="phone"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            v-model="editedItem.jdate"
                            label="Joining Date"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                            variant="outlined"
                            hide-details
                            v-model="editedItem.role"
                            label="Role"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12">
                        <v-select
                            variant="outlined"
                            hide-details
                            :items="rolesbg"
                            v-model="editedItem.rolestatus"
                            label="Role Background"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="error" @click="close">Cancel</v-btn>
                <v-btn
                    color="secondary"
                    :disabled="
                    editedItem.userinfo == '' || editedItem.usermail == ''
                  "
                    variant="flat"
                    @click="save"
                >Save
                </v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <v-data-table
          :headers="headers"
          :items="filteredItems"
          :search="search"
          item-value="name"
          class="elevation-1"
      >
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
              <v-icon
                  small
                  class="mr-2 text-info cursor-pointer"
                  @click="editItem(item.value)"
                  title="Edit"
              >mdi-pencil
              </v-icon
              >
              <v-icon
                  small
                  class="text-error cursor-pointer"
                  title="Delete"
                  @click="deleteItem(item.value)"
              >mdi-delete
              </v-icon
              >
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import {VDataTable} from 'vuetify/labs/VDataTable'

export default {
  name: "UsersIndex",
  components: {
    VDataTable,
  },
  computed: {
    ...mapGetters({
      items: 'getItems',
      loading: 'getLoading',
      referentiels: 'getReferentiels',
    }),
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
    editItem: function (item) {
      console.log(item);
    },
    deleteItem: function (item) {
      console.log(item);
    },
    enableItem: function (item) {
      console.log(item);
    },
    disableItem: function (item) {
      console.log(item);
    }
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
    this.$store.dispatch('items');
    this.$store.dispatch('referentiels');
  },
}
</script>

<style scoped>

</style>