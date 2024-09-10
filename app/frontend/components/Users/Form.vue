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
        <v-tab value="reconnaissances" v-if="canEditProfil">Reconnaissances</v-tab>
        <v-tab value="parcours">Parcours</v-tab>
        <v-tab value="responsabilites" v-if="canEditProfil">Responsabilités nationales</v-tab>
        <v-tab value="cotisations" v-if="canEditProfil">Cotisations</v-tab>
        <v-tab value="roles" v-if="canEditProfil">Roles globals</v-tab>
        <v-tab value="security">Securité</v-tab>
        <v-tab value="danger-zone" variant="flat" color="red" prepend-icon="mdi-alert" v-if="canEditProfil">
          Danger zone
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item key="infos" value="infos">
          <v-row>
            <v-col cols="12" sm="3">
              <div class="logo w-50 mx-auto">
                <v-img v-if="this.editedItem.user.id" style="border-radius: 100%;"
                  :src="'/avatars/' + this.editedItem.user.id + '.png'"
                  :lazy-src="'/avatars/' + this.editedItem.user.id + '.png'" cover aspect-ratio="1">
                </v-img>
                <v-img v-else style="border-radius: 100%;" src="https://fakeimg.pl/500x500" cover aspect-ratio="1">
                </v-img>
              </div>

              <v-file-input label="Avatar" prepend-icon="mdi-camera" @change="prepareAvatar($event.target.files)"
                accept="image/*" show-size class="mt-5">
              </v-file-input>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field v-model="editedItem.user.firstname" label="Prénom" validate-on="blur"
                :rules="[rules.required]"></v-text-field>
              <v-text-field v-model="editedItem.user.lastname" label="Nom" validate-on="blur"
                :rules="[rules.required]"></v-text-field>
              <v-text-field type="date" v-model="editedItem.user.birthdate" label="Date de naissance"></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field v-model="editedItem.user.email" type="email" label="Email" validate-on="blur"
                :rules="[rules.required]"></v-text-field>
              <v-text-field v-model="editedItem.user.phone_1" label="Téléphone"></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field v-model="editedItem.user.address_1" label="Adresse" required></v-text-field>
              <v-text-field v-model="editedItem.user.address_2" label="Complément" required></v-text-field>
              <v-text-field v-model="editedItem.user.zipcode" label="Code postal" required></v-text-field>
              <v-text-field v-model="editedItem.user.town" label="Ville" required></v-text-field>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <v-btn color="info" @click="sendInvitation()" class="mr-3"
            v-if="this.canEditProfil && editedItem.user.invitation_accepted_at === null">
            <v-icon class="mr-2">mdi-send</v-icon>
            Envoyer l'invitation à nouveau
          </v-btn>
        </v-window-item>
        <v-window-item key="reconnaissances" value="reconnaissances">
          <v-row>
            <v-col cols="12" sm="11">
              <v-row class="mb-1" v-for="career in editedItem.gratitudes"
                :key="career.id" justify="center">
                <v-col>
                  <v-select v-model="career.level" :items="referentiels.levels" hide-details label="Reconnaissance">
                  </v-select>
                </v-col>
                <v-col>
                  <v-text-field v-model="career.start_at" type="date" label="Depuis le" hide-details></v-text-field>
                </v-col>
                <v-col>
                  <v-btn @click="removeGratitude(career.id)" color="red" icon size="x-small">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="1">
              <v-btn color="green" @click="addGratitude()" icon size="x-small">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item key="parcours" value="parcours">
          <v-row>
            <v-col cols="12" sm="11">
              <v-row class="mb-1" v-for="phase in editedItem.phases"
                :key="phase.id" justify="center">
                <v-col cols="12" sm="4">
                  <v-autocomplete v-model="phase.church_id" :items="referentiels.churches" item-value="id"
                    item-title="name" hide-details label="Eglise">
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-select v-model="phase.function" :items="referentiels.functions" hide-details label="Fonction">
                  </v-select>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-text-field v-model="phase.start_at" type="date" label="Depuis le" hide-details></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-text-field v-model="phase.end_at" type="date" label="Jusqu'au" hide-details></v-text-field>
                </v-col>
                <v-col>
                  <v-btn @click="removePhase(phase.id)" color="red" icon size="x-small">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="1">
              <v-btn color="green" @click="addPhase()" icon size="x-small">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item key="responsabilites" value="responsabilites">
          <v-row>
            <v-col cols="12" sm="11">
              <v-row class="mb-1" v-for="phase in editedItem.responsabilities"
                :key="phase.id" justify="center">
                <v-col cols="12" sm="4">
                  <v-autocomplete v-model="phase.association_id" :items="referentiels.associations" item-value="id"
                    item-title="name" hide-details label="Association">
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-select v-model="phase.function" :items="referentiels.responsabilities" hide-details label="Fonction">
                  </v-select>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-text-field v-model="phase.start_at" type="date" label="Depuis le" hide-details></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-text-field v-model="phase.end_at" type="date" label="Jusqu'au" hide-details></v-text-field>
                </v-col>
                <v-col>
                  <v-btn @click="removeResponsabilite(phase.id)" color="red" icon size="x-small">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="1">
              <v-btn color="green" @click="addResponsabilite()" icon size="x-small">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item key="cotisations" value="cotisations">
          <v-row>
            <v-col cols="12" sm="11">
              <v-row class="bg-grey-lighten-4 pa-5 rounded elevation-1 mb-3" v-for="fee in editedItem.fees" :key="fee.id"
                justify="center">
                <v-col cols="12" sm="4">
                  <v-combobox v-model="fee.what" :items="referentiels.whatFees" hide-details label="Année">
                  </v-combobox>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field v-model="fee.paid_at" type="date" label="Payée le" hide-details></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field v-model="fee.amount" type="number" label="Montant" hide-details></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="1">
              <v-btn color="green" @click="addFee()" icon size="x-small">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item key="roles" value="roles">
          <v-row>
            <v-col>
              <v-card>
                <v-card-text>
                  <v-btn v-if="!editedItem.roles.includes('admin')" @click="addRole('admin')" color="primary"
                    class="mr-3">Promouvoir administrateur
                  </v-btn>
                  <v-btn v-else @click="removeRole('admin')" color="secondary" class="mr-3">Destituer administrateur
                  </v-btn>

                  <v-btn v-if="!editedItem.roles.includes('moderator')" @click="addRole('moderator')" color="primary"
                    class="mr-3">Promouvoir modérateur
                  </v-btn>
                  <v-btn v-else @click="removeRole('moderator')" color="secondary" class="mr-3">Destituer modérateur
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item key="security" value="security">
          <v-alert type="info" icon="mdi-information-outline" class="mb-3">
            Pour modifier le mot de passe, remplissez les champs ci-dessous. Sinon, laissez-les vides.
          </v-alert>

          <v-text-field v-model="editedItem.user.password" type="password" label="Mot de passe" required></v-text-field>
          <v-text-field v-model="editedItem.user.password_confirmation" type="password" label="Confirmer le mot de passe"
            required></v-text-field>
        </v-window-item>
        <v-window-item key="danger-zone" value="danger-zone">
          <v-alert type="error" icon="mdi-alert-circle-outline" class="mb-3">
            Vous êtes dans la zone de danger, les actions ci-dessous doivent-etres effectuées avec précaution !
          </v-alert>
          <v-btn color="red" @click="tryDeleteItem()" class="mr-3">Supprimer l'utilisateur</v-btn>

          <v-btn color="yellow" @click="disableItem(this.editedItem.user)" class="mr-3" prepend-icon="mdi-account-off"
            v-if="!editedItem.user.disabled">
            Désactiver l'utilisateur
          </v-btn>
          <v-btn color="green" @click="enableItem(this.editedItem.user)" class="mr-3" prepend-icon="mdi-account-check"
            v-else>
            Activer l'utilisateur
          </v-btn>
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-card-actions class="bg-blue-lighten-5">
      <v-spacer></v-spacer>
      <v-btn color="red" @click="close()">Annuler</v-btn>
      <v-btn color="blue" @click="save()">Enregistrer</v-btn>
    </v-card-actions>


    <v-dialog v-model="dialogConfirmDelete">
      <v-card color="red" variant="flat">
        <v-card-text>
          Etes-vous sûr de vouloir supprimer cet utilisateur ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" variant="outlined" @click="dialogConfirmDelete = false">Annuler</v-btn>
          <v-btn color="white" variant="outlined" @click="deleteItem(this.deletingItem)">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "UserForm",
  computed: {
    ...mapGetters('usersStore', {
      items: 'getItems',
      item: 'getItem',
      dialogForm: 'getDialogForm',
      referentiels: 'getReferentiels',
      formLoading: 'getFormLoading',
    }),
    ...mapGetters('sessionStore', {
      currentUser: 'currentUser',
      roles: 'roles',
    }),
    getTitle() {
      return (this.editedItem && !this.editedItem.id) ? "Ajouter un utilisateur" : "Modifier un utilisateur";
    },
    canEditProfil() {
      // current_user can edit all profil if he is admin OR if he is not the user he want to edit
      // check if this.item has user property

      return this.roles.includes('admin') || (this.item && this.item.user && this.currentUser.id !== this.item.user.id);
    },
  },
  methods: {
    close() {
      this.$store.commit('usersStore/setFormLoading', true);
      this.$store.commit('usersStore/setDialogForm', false);
      this.$store.commit('usersStore/setItem', null);
    },
    enableItem: function (item) {
      this.$store.dispatch('usersStore/enable', item.id).then(response => {
        item.disabled = false;
        this.$root.showSnackbar('Utilisateur activé avec succès', 'success');
      });
    },
    disableItem: function (item) {
      this.$store.dispatch('usersStore/disable', item.id).then(response => {
        item.disabled = true;
        this.$root.showSnackbar('Utilisateur désactivé avec succès', 'success');
      });
    },
    tryDeleteItem: function (item) {
      this.deletingItem = JSON.parse(JSON.stringify(this.editedItem));
      this.dialogConfirmDelete = true;
    },
    deleteItem: function (item) {
      this.$store.dispatch('usersStore/delete', this.deletingItem.user.id).then(response => {
        this.dialogConfirmDelete = false;
        this.deletingItem = {};
        this.$root.showSnackbar('Utilisateur supprimé avec succès', 'success');
      });
    },
    sendInvitation: function (item) {
      this.$store.dispatch('usersStore/sendInvitation', this.editedItem.user).then(response => {
        this.$root.showSnackbar('Invitation envoyée', 'success');
      });
    },
    prepareAvatar(file) {
      if (!file.length) {
        this.$root.showSnackbar("Aucun fichier sélectionné", 'warning');
        return;
      }

      if (file.length > 1) {
        this.$root.showSnackbar("Vous devez sélectionner un seul fichier", 'warning');
        return;
      }

      this.editedItem.user.avatar = file[0];
    },
    save() {
      this.$store.dispatch('usersStore/save', this.editedItem).then(response => {
        if (this.currentUser.id !== this.editedItem.user.id) {
          this.$root.showSnackbar('Utilisateur enregistré avec succès', 'success');
          this.$store.dispatch('usersStore/fetchItems');
        } else {
          this.$root.showSnackbar('Profil enregistré avec succès', 'success');
          this.$store.dispatch('sessionStore/fetchUser');
        }
        this.close();
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de l\'utilisateur', 'error');
        let errors = error.response.data.errors;

        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    addRole(role) {
      this.$store.dispatch('usersStore/addRole', {
        id: this.editedItem.user.id,
        role: role,
      }).then(response => {
        this.editedItem.roles.push(role);
        this.$root.showSnackbar('Utilisateur promu', 'success');
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu', 'error');
        let errors = error.response.data.errors;

        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    removeRole(role) {
      this.$store.dispatch('usersStore/removeRole', {
        id: this.editedItem.user.id,
        role: role,
      }).then(response => {
        this.editedItem.roles.splice(this.editedItem.roles.indexOf(role), 1);
        this.$root.showSnackbar('Utilisateur destitué', 'success');
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu', 'error');
        let errors = error.response.data.errors;

        this.$root.showSnackbar(errors.join('<br/>'), 'error');
      });
    },
    addGratitude() {
      this.editedItem.gratitudes.push({
        level: null,
        start_at: null,
      });
    },
    removeGratitude(id) {
      // If id is null then remove last inserted
      if (id === null){
        this.editedItem.gratitudes.pop();
      }else{
        this.editedItem.gratitudes.splice(this.editedItem.gratitudes.findIndex(career => career.id === id), 1);
      }
    },
    addFee() {
      this.editedItem.fees.push({
        what: null,
        paid_at: null,
        amount: null,
      });
    },
    addPhase() {
      this.editedItem.phases.push({
        church_id: null,
        function: null,
        start_at: null,
        end_at: null,
      });
    },
    removePhase(id) {
      // If id is null then remove last inserted
      if (id === null){
        this.editedItem.phases.pop();
      }else{
        this.editedItem.phases.splice(this.editedItem.phases.findIndex(phase => phase.id === id), 1);
      }
    },
    addResponsabilite() {
      this.editedItem.responsabilities.push({
        association_id: null,
        function: null,
        start_at: null,
        end_at: null,
      });
    },
    removeResponsabilite(id){
      if (id === null){
        this.editedItem.responsabilities.pop();
      }else{
        this.editedItem.responsabilities.splice(this.editedItem.responsabilities.findIndex(phase => phase.id === id), 1);
      }
    }
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler: function () {
        this.editedItem = JSON.parse(JSON.stringify(this.item));
        if (this.editedItem && this.editedItem.user) {
          this.editedItem.user.password = null;
          this.editedItem.user.password_confirmation = null;
        }
      },
    },
  },
  data() {
    return {
      editedItem: {},
      deletingItem: {},
      dialogConfirmDelete: false,
      loadingDelete: false,
      tab: 'infos',
      rules: {
        required: value => !!value || 'Champ obligatoire',
      },
    };
  },
  beforeMount: function () {
    this.$store.dispatch('usersStore/referentiels');
  },
}
</script>

<style scoped></style>