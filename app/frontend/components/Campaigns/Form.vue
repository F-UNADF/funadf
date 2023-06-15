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
        <v-tab value="motions">Motions</v-tab>
        <v-tab value="voting-tables">Table des votes</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item key="infos" value="infos" class="py-3">
          <h3>Informations générales</h3>

          <v-autocomplete
              v-model="editedItem.structure_id"
              :items="referentiels.structures"
              item-value="id"
              item-title="name"
              hide-details
              label="Structure">
          </v-autocomplete>

          <v-text-field
              v-model="editedItem.name"
              label="Nom"
              :rules="[rules.required]"
              required>
          </v-text-field>

          <v-row>
            <v-col>
              <v-text-field
                  v-model="editedItem.start_at"
                  type="datetime"
                  label="Date de début"
                  required>
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                  v-model="editedItem.end_at"
                  type="datetime"
                  label="Date de fin"
                  required>
              </v-text-field>

            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item key="motions" value="motions" class="py-3">
          <h3>Motions</h3>

        </v-window-item>

        <v-window-item key="voting-tables" value="voting-tables" class="py-3">
          <h3>Table des votes</h3>
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
import {VDataTable} from 'vuetify/labs/VDataTable'

export default {
  name: "CampaignForm",
  components: {
    VDataTable
  },
  computed: {
    ...mapGetters('campaignsStore', {
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
      this.$store.commit('campaignsStore/setDialogForm', false);
      this.$store.commit('campaignsStore/setItem', {});
    },
    save() {
      this.$store.dispatch('campaignsStore/save', this.editedItem).then(response => {
        this.$root.showSnackbar('Eglise enregistrée avec succès', 'success');
        this.search = response.zipcode;
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
      console.log(this.addingMembers);
      this.$store.dispatch('campaignsStore/addMembers', this.addingMembers).then(response => {
        this.$root.showSnackbar('Membres ajoutés avec succés', 'success');
        this.addingMembers = [];
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement des membres', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    setRole(member, role) {
      this.$store.dispatch('campaignsStore/setRole', {member: member, role: role}).then(response => {
        this.$root.showSnackbar('Role modifié avec succés', 'success');
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de la modification du role', 'error');
        let errors = error.response.data.errors;
        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    removeMember(membership_id) {
      this.$store.dispatch('campaignsStore/removeMember', membership_id).then(response => {
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
        {title: 'Nom', key: 'name', sortable: true},
        {title: 'Role', key: 'role_name', sortable: true},
        {title: 'Actions', key: 'actions', sortable: false},
      ],
      rules: {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },
}
</script>

<style scoped>

</style>