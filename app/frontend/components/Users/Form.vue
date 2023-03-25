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
        <v-tab value="reconnaissances">Reconnaissances</v-tab>
        <v-tab value="parcours">Parcours</v-tab>
        <v-tab value="responsabilites">Responsabilités nationales</v-tab>
        <v-tab value="cotisations">Cotisations</v-tab>
        <v-tab value="security">Securité</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item key="infos" value="infos">
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                  v-model="editedItem.user.firstname"
                  label="Prénom"
              ></v-text-field>
              <v-text-field
                  v-model="editedItem.user.lastname"
                  label="Nom"
              ></v-text-field>
              <v-text-field
                type="date"
                v-model="editedItem.user.birthdate"
                label="Date de naissance"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                  v-model="editedItem.user.email"
                  label="Email"
                  required
              ></v-text-field>
              <v-text-field
                  v-model="editedItem.user.phone_1"
                  label="Téléphone"
                  required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                  v-model="editedItem.user.address_1"
                  label="Adresse"
                  required
              ></v-text-field>
              <v-text-field
                  v-model="editedItem.user.address_2"
                  label="Complément"
                  required
              ></v-text-field>
              <v-text-field
                  v-model="editedItem.user.zipcode"
                  label="Code postal"
                  required
              ></v-text-field>
              <v-text-field
                  v-model="editedItem.user.town"
                  label="Ville"
                  required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item key="reconnaissances" value="reconnaissances">
          <v-row>
            <v-col cols="12" sm="11">
              <v-row class="bg-grey-lighten-4 pa-5 rounded elevation-1 mb-3" v-for="career in editedItem.gratitudes" :key="career.id" justify="center">
                <v-col cols="12" sm="4">
                  <v-select
                      v-model="career.level"
                      :items="referentiels.levels"
                      hide-details
                      label="Reconnaissance">
                  </v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                      v-model="career.start_at"
                      type="date"
                      label="Depuis le"
                      hide-details
                  ></v-text-field>
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

        <v-window-item key="cotisations" value="cotisations">
          <v-row>
            <v-col cols="12" sm="11">
              <v-row class="bg-grey-lighten-4 pa-5 rounded elevation-1 mb-3" v-for="fee in editedItem.fees" :key="fee.id" justify="center">
                <v-col cols="12" sm="4">
                  <v-combobox
                      v-model="fee.what"
                      :items="referentiels.whatFees"
                      hide-details
                      label="Année">
                  </v-combobox>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                      v-model="fee.paid_at"
                      type="date"
                      label="Payée le"
                      hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                      v-model="fee.amount"
                      type="number"
                      label="Payée le"
                      hide-details
                  ></v-text-field>
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

        <v-window-item key="parcours" value="parcours">
          <v-row>
            <v-col cols="12" sm="11">
              <v-row class="bg-grey-lighten-4 pa-5 rounded elevation-1 mb-3" v-if="editedItem.phases.length > 0" v-for="phase in editedItem.phases" :key="phase.id" justify="center">
                <v-col cols="12" sm="5">
                  <v-autocomplete
                      v-model="phase.church_id"
                      :items="referentiels.churches"
                      item-value="id"
                      item-title="name"
                      hide-details
                      label="Eglise">
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-select
                      v-model="phase.function"
                      :items="referentiels.functions"
                      hide-details
                      label="Fonction">
                  </v-select>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-text-field
                      v-model="phase.start_at"
                      type="date"
                      label="Depuis le"
                      hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-text-field
                      v-model="phase.end_at"
                      type="date"
                      label="Jusqu'au"
                      hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="12" class="text-center">
                  <v-alert type="yellow-darken-3" icon="mdi-information-outline">
                    Aucun élément à afficher
                  </v-alert>
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
              <v-row class="bg-grey-lighten-4 pa-5 rounded elevation-1 mb-3" v-if="editedItem.responsabilities.length > 0" v-for="phase in editedItem.responsabilities" :key="phase.id" justify="center">
                <v-col cols="12" sm="5">
                  <v-autocomplete
                      v-model="phase.church_id"
                      :items="referentiels.associations"
                      item-value="id"
                      item-title="name"
                      hide-details
                      label="Association">
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-select
                      v-model="phase.function"
                      :items="referentiels.responsabilities"
                      hide-details
                      label="Fonction">
                  </v-select>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-text-field
                      v-model="phase.start_at"
                      type="date"
                      label="Depuis le"
                      hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-text-field
                      v-model="phase.end_at"
                      type="date"
                      label="Jusqu'au"
                      hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="12" class="text-center">
                  <v-alert type="yellow-darken-3" icon="mdi-information-outline">
                    Aucune responsabilité nationale
                  </v-alert>
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

        <v-window-item key="security" value="security">
          <v-text-field
              v-model="editedItem.password"
              label="Mot de passe"
              required
          ></v-text-field>
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
    getTitle() {
      return (this.editedItem.id === null) ? "Ajouter un utilisateur" : "Modifier un utilisateur";
    }
  },
  methods: {
    close() {
      this.$store.commit('usersStore/setDialogForm', false);
      this.$store.commit('usersStore/setItem', {});
    },
    save() {
      this.$store.dispatch('usersStore/save', this.editedItem).then(response => {
        this.$root.showSnackbar('Utilisateur enregistré avec succès', 'success');
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de l\'utilisateur', 'error');
      });
    },
    addGratitude() {
      this.editedItem.gratitudes.push({
        level: null,
        start_at: null,
      });
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
    addResponsabilite() {
      this.editedItem.responsabilities.push({
        church_id: null,
        function: null,
        start_at: null,
        end_at: null,
      });
    },
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler: function () {
        this.editedItem = JSON.parse(JSON.stringify(this.item));
      },
    },
  },

  data() {
    return {
      editedItem: {},
      tab: 'infos',
    };
  },
}
</script>

<style scoped>

</style>