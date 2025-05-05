<template>
  <v-progress-circular v-if="formLoading" indeterminate color="primary"></v-progress-circular>
  <v-card v-else>
    <v-card-title class="bg-blue text-white">
      <v-btn @click="close()" icon size="small" color="white" variant="outlined" class="mr-5">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      {{ this.getTitle }}
    </v-card-title>
    <v-card-text>
      <v-tabs color="primary" class="mb-3" align-tabs="center" v-model="tab">
        <v-tab value="infos">Informations générales</v-tab>
        <v-tab value="membres">Membres</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item key="infos" value="infos" class="py-3">
          <v-row>
            <v-col cols="12" md="3">
              <div class="logo w-50 mx-auto">
                <v-img v-if="this.editedItem.id !== null" style="border-radius: 100%;"
                       :src="'/logos/' + this.editedItem.id + '.png?cache=' + imgCache"
                       :lazy-src="'/logos/' + this.editedItem.id + '.png'" cover aspect-ratio="1">
                </v-img>
                <v-img v-else style="border-radius: 100%;" src="https://fakeimg.pl/500x500" cover aspect-ratio="1">
                </v-img>
              </div>

              <v-file-input label="Logo" prepend-icon="mdi-camera" @change="prepareLogo($event.target.files)"
                            accept="image/*" show-size class="mt-5">
              </v-file-input>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field v-model="editedItem.name" label="Nom" :rules="[rules.required]" required>
              </v-text-field>
              <v-text-field v-model="editedItem.address_1" label="Adresse">
              </v-text-field>
              <v-text-field v-model="editedItem.address_2" label="Complément d'adresse">
              </v-text-field>
              <v-row>
                <v-col cols="12" lg="6" md="6">
                  <v-text-field v-model="editedItem.zipcode" label="Code postal" :rules="[rules.required]" required>
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6">
                  <v-text-field v-model="editedItem.town" label="Ville" :rules="[rules.required]" required>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-text-field v-model="editedItem.email" label="Email">
              </v-text-field>
              <v-text-field v-model="editedItem.phone_1" label="Téléphone">
              </v-text-field>
            </v-col>

          </v-row>
        </v-window-item>

        <v-window-item key="membres" value="membres" class="py-3">
          <v-row justify="space-between">
            <v-col cols="12" lg="4" md="4" class="mb-3">
              <v-text-field density="compact" v-model.lazy="searchingMember" label="Chercher un membre par Nom"
                            hide-details variant="outlined" clearable></v-text-field>
            </v-col>
          </v-row>

          <!-- MEMBRES DE L'EGLISE -->
          <v-data-table :headers="headers" :items="this.members" density="compact" class="elevation-1">
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <div class="d-flex align-center py-4">
                    <v-avatar
                        :icon="(item.member_type == 'Structure') ? 'mdi-office-building' : 'mdi-account'"></v-avatar>
                    <div class="ml-5">
                      <h4>{{ item.name }}</h4>
                      <span class="subtitle-2 d-block font-weight-regular">{{
                          item.town
                        }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn color="secondary" v-bind="props">
                        {{ getRoleName(item.role_name) }}
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item v-for="(role, index) in this.referentiels.roles" :key="index"
                                   @click="setRole(item, index)">
                        <v-list-item-title>{{ role }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>
                <td>
                  <v-tooltip location="top" text="Supprimer le membre">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" small class="text-error" title="Delete"
                              @click="removeMember(item.membership_id)">
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>


          <!-- AJOUTER UN MEMBRE -->
          <div class="pa-6 bg-grey-lighten bg-grey-lighten-4">
            <h3 class="mb-3 pb-3">Ajouter des membres :</h3>

            <v-chip-group v-model="addingMembers" active-class="primary--text" mandatory class="mb-3">
              <v-chip v-for="(member, index) in addingMembers" :key="index" :value="member">
                {{ member.split('#')[2] }}
              </v-chip>
              <v-btn v-if="addingMembers.length > 0" color="primary" rounded="pill" @click="addMember()" variant="flat">
                Ajouter
              </v-btn>
            </v-chip-group>


            <v-text-field v-model="search" label="Chercher un membre : Nom, Ville, Code postal" hide-details
                          class="mb-3"
                          variant="outlined" aria-autocomplete="none">
            </v-text-field>

            <v-data-table v-model="addingMembers" :headers="headersMatching" :items="matchMembers"
                          :item-value="item => `${item.id}#${item.type}#${item.name}`" show-select class="elevation-1">
              <template v-slot:no-data>
                <v-alert type="info" class="m-5">
                  <p>Aucun membre ne correspond a votre recherche :</p>
                  <ul>
                    <li>Soit les membres ont déjà été ajoutés</li>
                    <li>Soit les utilisateurs n'existent pas encore</li>
                  </ul>
                </v-alert>
              </template>
            </v-data-table>
          </div>

        </v-window-item>
      </v-window>
    </v-card-text>
    <v-card-actions class="bg-blue-lighten-5">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="close()">Annuler</v-btn>
      <v-btn color="blue" @click="save()">Enregistrer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import {VAlert} from "vuetify/lib/components/index.mjs";

function debounce(fn, delay) {
  var timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    var args = arguments
    var that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}

export default {
  name: "ChurchForm",
  components: {
    VAlert
  },
  computed: {
    ...mapGetters('churchesStore', {
      items: 'getItems',
      item: 'getItem',
      members: 'getMembers',
      formLoading: 'getFormLoading',
      dialogForm: 'getDialogForm',
      referentiels: 'getReferentiels',
    }),
    getTitle() {
      return (this.editedItem.id === null) ? "Ajouter une église" : "Modifier une église";
    },
  },
  methods: {
    close() {
      this.$store.commit('churchesStore/setDialogForm', false);
      this.$store.commit('churchesStore/setItem', {});
    },
    save() {
      this.$store.dispatch('churchesStore/save', this.editedItem).then(response => {
        this.$root.showSnackbar('Eglise enregistrée avec succès', 'success');
        this.close();
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de l\'eglise', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    prepareLogo(file) {
      if (!file.length) {
        this.$root.showSnackbar("Aucun fichier sélectionné", 'warning');
        return;
      }

      if (file.length > 1) {
        this.$root.showSnackbar("Vous devez sélectionner un seul fichier", 'warning');
        return;
      }

      this.editedItem.logo = file[0];
    },
    getRoleName(role) {
      let roles = this.referentiels.roles;
      if (roles.hasOwnProperty(role)) {
        return roles[role];
      }
      return role;
    },
    updateMatchingMembers() {
      let search = this.search.toLowerCase();
      if (search.length < 3) {
        this.matchMembers = [];
        return;
      }

      let members = this.referentiels.members;

      //remove from members the members already in the church
      // let membersInChurch = this.members.map((member) => [member.member_id, member.member_type].join('#'));
      // console.log(membersInChurch);
      // members = members.filter((member) => !membersInChurch.includes([member.member_id, member.member_type].join('#')));

      // console.log(members);


      let matchMembers = members.filter((member) =>
          member.name.toLowerCase().includes(search)
      ).map((member) => ({
        id: member.member_id,
        type: member.member_type,
        name: member.name,
        title: member.name,
        icon: (member.member_type == 'Structure') ? 'mdi-account-group' : 'mdi-account',
      }));
      this.matchMembers = matchMembers;
    },
    addMember() {
      this.$store.dispatch('churchesStore/addMembers', this.addingMembers).then(response => {
        this.$root.showSnackbar('Membres ajoutés avec succés', 'success');
        this.addingMembers = [];
        this.search = '';
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement des membres', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    setRole(member, role) {
      this.$store.dispatch('churchesStore/setRole', {member: member, role: role}).then(response => {
        this.$root.showSnackbar('Role modifié avec succés', 'success');
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de la modification du role', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    removeMember(membership_id) {
      this.$store.dispatch('churchesStore/removeMember', membership_id).then(response => {
        this.$root.showSnackbar('Membre supprimé avec succés', 'success');
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de la suppression du membre', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler: function () {
        this.editedItem = JSON.parse(JSON.stringify(this.item));
        this.editedMembers = JSON.parse(JSON.stringify(this.members));
      },
    },
    search: function () {
      this.updateMatchingMembers();
    }
  },

  data() {
    return {
      editedItem: {},
      editedMembers: [],
      addingMembers: [],
      matchMembers: [],
      search: '',
      searchingMember: '',
      imgCache: 0,
      tab: 'infos',
      roleDialog: false,
      headers: [
        {title: 'Nom', key: 'name', sortable: true},
        {title: 'Role', key: 'role_name', sortable: true},
        {title: 'Actions', key: 'actions', sortable: false},
      ],
      headersMatching: [
        {title: 'Nom', key: 'name', sortable: true},
        {title: 'Actions', key: 'actions', sortable: false},
      ],
      rules: {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },
}
</script>

<style scoped></style>