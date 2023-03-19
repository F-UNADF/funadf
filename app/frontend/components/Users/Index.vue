<template>
  <v-card>
    <v-card-text class="pa-5">
      <v-row>
        <v-col cols="12" lg="4" md="6">
          <v-text-field
              density="compact"
              v-model="search"
              label="Search Contacts"
              hide-details
              variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" lg="8" md="6" class="text-right">
          <v-dialog v-model="dialog">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props" class="ml-auto">
                <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Add
                Contact
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
                >Save</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <v-table class="mt-5">
        <thead>
        <tr>
          <th>Id</th>
          <th>Info</th>
          <th>Téléphone</th>
          <th>Reconnaissance</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody v-if="!loading">
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>
              <div class="d-flex align-center py-4">
                <div>
                  <v-img
                      :src="item.avatar_url"
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
            <td>{{ item.phone }}</td>
            <td>
              <v-chip color="info" label>{{ item.current_level }}</v-chip>
            </td>
            <td>
              <v-icon
                  small
                  class="mr-2 text-info cursor-pointer"
                  @click="editItem(item)"
                  title="Edit"
              >mdi-pencil</v-icon
              >
              <v-icon
                  small
                  class="text-error cursor-pointer"
                  title="Delete"
                  @click="deleteItem(item)"
              >mdi-delete</v-icon
              >
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5" class="text-center">
              <v-progress-linear indeterminate color="primary"></v-progress-linear>
            </td>
          </tr>
        </tbody>
      </v-table>
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
    }),
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
      headers: [
        {title: 'ID', key: 'id', sortable: true, display: true},
        {title: 'Nom', key: 'lastname', sortable: true, display: true},
        {title: 'Prenom', key: 'firstname', display: false},
        {title: 'Email', align: 'start', key: 'email', sortable: true, display: true},
        {title: 'Niveau', align: 'start', key: 'current_level', sortable: true, display: true},
        {title: 'Actions', key: 'actions', sortable: false},
      ],
    }
  },
  beforeMount: function () {
    this.$store.dispatch('items');
  },
}
</script>

<style scoped>

</style>