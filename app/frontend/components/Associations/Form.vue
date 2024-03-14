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
              <v-text-field density="compact" v-model="searchingMember" label="Chercher un membre par Nom" hide-details
                variant="outlined" clearable></v-text-field>
            </v-col>
          </v-row>

          <v-data-table :headers="headers" :items="this.editedMembers" :search="searchingMember" density="compact"
            class="elevation-1">
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <div class="d-flex align-center">
                    <v-avatar
                      :icon="(item.member_type == 'Structure') ? 'mdi-office-building' : 'mdi-account'"></v-avatar>
                    <div class="ml-3">
                      <h4>{{ item.name }}</h4>
                    </div>
                  </div>
                </td>
                <td>
                  <div v-if="item.town !== null" class="d-flex align-center">
                    <v-icon>mdi-map-marker</v-icon>
                    <div class="ml-3">
                      <h4>{{ item.town }} <small>({{ item.zipcode }})</small></h4>
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
                      <v-list-item v-for="( role, index ) in  this.referentiels.roles " :key="index"
                        @click="setRole(item, index)">
                        <v-list-item-title>{{ role }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>
                <td>
                  <v-switch v-model="item.can_vote" inset color="secondary" size="small" label="Peut voter ?"
                    @change="setCanVote(item)"></v-switch>
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

          <div class="pa-6 bg-grey-lighten bg-grey-lighten-4">
            <h3 class="mb-3 pb-3">Ajouter des membres :</h3>
            <v-autocomplete v-model="addingMembers" v-model:search="search" :items="this.matchMembers"
              :item-value="item => item" hide-no-data hide-details required @change="addMember" multiple closable-chips
              chips label="Ajouter un membre">
              <template v-slot:chip="{ props, item }">
                <v-chip v-bind="props" :prepend-icon="item?.icon" :text="item?.name"></v-chip>
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :prepend-icon="item?.icon" :title="item.title"></v-list-item>
              </template>
            </v-autocomplete>

            <v-btn color="primary" class="mt-5" @click="addMember">
              Ajouter les membres
            </v-btn>
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
import { mapGetters } from "vuex";
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
  name: "AssociationForm",
  components: {
    VDataTable
  },
  computed: {
    ...mapGetters('associationsStore', {
      items: 'getItems',
      item: 'getItem',
      members: 'getMembers',
      formLoading: 'getFormLoading',
      dialogForm: 'getDialogForm',
      referentiels: 'getReferentiels',
    }),
    getTitle() {
      return (this.editedItem.id === null) ? "Ajouter une association" : "Modifier une association";
    },
  },
  methods: {
    close() {
      this.$store.commit('associationsStore/setDialogForm', false);
      this.$store.commit('associationsStore/setItem', {});
    },
    save() {
      this.$store.dispatch('associationsStore/save', this.editedItem).then(response => {
        this.$root.showSnackbar('Association enregistrée avec succès', 'success');
        this.close();
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de l\'association', 'error');
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
      this.$store.dispatch('associationsStore/addMembers', this.addingMembers).then(response => {
        this.$root.showSnackbar('Membres ajoutés avec succés', 'success');
        this.addingMembers = [];
        //update EditedMembers
        this.$store.dispatch('associationsStore/item', this.editedItem.id);
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement des membres', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    setRole(member, role) {
      this.$store.dispatch('associationsStore/setRole', { member: member, role: role }).then(response => {
        this.$store.dispatch('associationsStore/item', this.editedItem.id);
        this.$root.showSnackbar('Role modifié avec succés', 'success');
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de la modification du role', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    setCanVote(member) {
      this.$store.dispatch('associationsStore/updateMembership', member).then(response => {
        this.$root.showSnackbar('Membre modifié avec succés', 'success');
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de la modification du role', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    removeMember(membership_id) {
      this.$store.dispatch('associationsStore/removeMember', membership_id).then(response => {
        this.$root.showSnackbar('Membre supprimé avec succés', 'success');
        //remove members from editedMembers
        this.editedMembers = this.editedMembers.filter((member) => member.membership_id !== membership_id);
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
    search(val) {
      val && this.updateMatchingMembers()
    },
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
        { title: 'Nom', key: 'name', sortable: true },
        { title: 'Ville', key: 'town', sortable: true },
        { title: 'Role', key: 'role_name', sortable: true },
        { title: 'Peut voter ?', key: 'can_vote', sortable: true },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      rules: {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },
}
</script>

<style scoped></style>