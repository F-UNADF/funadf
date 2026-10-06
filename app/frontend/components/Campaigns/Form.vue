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
      <v-alert v-if="errors.length > 0" class="mb-3" type="error" variant="tonal" closable @click:close="errors = []">
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </v-alert>
      <v-row>
        <v-col cols="12" md="6">
          <v-autocomplete v-model="editedItem.structure_id" :items="referentiels.structures" item-value="id"
            item-title="name" label="Structure organisatrice" :rules="[this.rules.required]">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="editedItem.name" label="Nom de la campagne" :rules="[rules.required]">
          </v-text-field>
        </v-col>
      </v-row>

      <v-tabs color="primary" class="mb-3" align-tabs="center" v-model="tab">
        <v-tab value="motions">Résolutions ({{ (editedItem.motions || []).length }})</v-tab>
        <v-tab value="voting-tables">Table des votes</v-tab>
        <v-tab value="results" v-if="editedItem.state !== 'coming'">Résultats</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item key="motions" value="motions" class="py-3">
          <p class="text-body-2 text-medium-emphasis mb-4">
            Les résolutions sont présentées aux votants dans cet ordre.
          </p>
          <div v-for="(motion, index) in editedItem.motions" :key="index" class="motion" data-test="motion">
            <div class="motion__number" aria-hidden="true">{{ index + 1 }}</div>
            <div class="motion__body">
              <v-text-field v-model="motion.name" :label="`Intitulé de la résolution ${index + 1}`"
                :rules="[rules.required, rules.max255]" :disabled="!editable" density="comfortable"></v-text-field>
              <v-btn-toggle v-model="motion.kind" mandatory divided variant="outlined" color="primary"
                density="comfortable" class="motion__kind" :disabled="!editable">
                <v-btn value="binary">Oui / Non</v-btn>
                <v-btn value="neutral">Oui / Non / Neutre</v-btn>
                <v-btn value="free">Texte libre</v-btn>
                <v-btn value="choices">Choix multiple</v-btn>
              </v-btn-toggle>
              <v-row v-if="motion.kind === 'choices'" class="mt-2">
                <v-col cols="12" sm="8">
                  <v-text-field :disabled="!editable" v-model="motion.choices" label="Choix proposés"
                    persistent-hint density="comfortable"
                    hint="Séparez les choix par des virgules, par exemple : Choix 1,Choix 2,Choix 3"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field :disabled="!editable" v-model="motion.max_choice" type="number" min="1"
                    label="Nombre de réponses maximum" persistent-hint density="comfortable"
                    hint="Par défaut : 1"></v-text-field>
                </v-col>
              </v-row>
            </div>
            <div class="motion__actions">
              <v-btn icon="mdi-chevron-up" variant="text" size="small" :disabled="!editable || index === 0"
                :aria-label="`Monter la résolution ${index + 1}`" @click="moveMotionUp(motion)"></v-btn>
              <v-btn icon="mdi-chevron-down" variant="text" size="small"
                :disabled="!editable || index === editedItem.motions.length - 1"
                :aria-label="`Descendre la résolution ${index + 1}`" @click="moveMotionDown(motion)"></v-btn>
              <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" :disabled="!editable"
                :aria-label="`Supprimer la résolution ${index + 1}`" @click="removeMotion(motion)"></v-btn>
            </div>
          </div>
          <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" class="mt-4" @click="addMotion()"
            :disabled="!editable">
            Ajouter une résolution
          </v-btn>
        </v-window-item>

        <v-window-item key="voting-tables" value="voting-tables" class="py-3">
          <voting-tables-panel :voting-tables="editedItem.voting_tables" :structure-id="editedItem.structure_id"
            :positions="referentiels.positions || []" :disabled="!editable"></voting-tables-panel>
        </v-window-item>

        <v-window-item key="results" value="results" class="py-3">
          <v-container v-if="editedItem.state === 'closed'">
            <v-table density="compact" border hover>
              <!-- VOTE BINAIRE / NEUTRE -->
              <thead v-if="this.editedItem.results.length > 0">
                <tr>
                  <th></th>
                  <th colspan="6">Votes comptabilisés</th>
                  <th v-if="this.hasConsultative()" colspan="6">Votes consultatifs</th>
                </tr>
                <tr>
                  <th></th>
                  <th rowspan="2">Nb de votant</th>
                  <th colspan="4" class="bg-blue-lighten-1">Voix exprimées</th>
                  <th>Voix non exprimées</th>
                  <template v-if="this.hasConsultative()">
                    <th rowspan="2">Nb de votant</th>
                    <th colspan="4" class="bg-blue-lighten-1">Voix exprimées</th>
                    <th>Voix non exprimées</th>
                  </template>
                </tr>
                <tr>
                  <th></th>
                  <th>Oui</th>
                  <th>Non</th>
                  <th>Neutre</th>
                  <th>Total</th>
                  <th></th>
                  <template v-if="this.hasConsultative()">
                    <th>Oui</th>
                    <th>Non</th>
                    <th>Neutre</th>
                    <th>Total</th>
                    <th></th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr v-for="result in this.editedItem.results" :key="result.id">
                  <th>{{ result.motion_name }}</th>
                  <td>{{
                    result.non_consultative_yes_count + result.non_consultative_no_count +
                    result.non_consultative_neutre_count + result.non_consultative_null_count
                    }}
                  </td>
                  <td>
                    {{ result.non_consultative_yes_count }}

                    <span class="small"
                      v-if="result.non_consultative_yes_count + result.non_consultative_no_count !== 0">
                      ({{
                        ((result.non_consultative_yes_count / (result.non_consultative_yes_count +
                          result.non_consultative_no_count + result.non_consultative_neutre_count)) * 100).toFixed(
                            2)
                      }}%)
                    </span>
                    <span class="small" v-else>
                      (0%)
                    </span>
                  </td>
                  <td>
                    {{ result.non_consultative_no_count }}

                    <span class="small"
                      v-if="result.non_consultative_yes_count + result.non_consultative_no_count !== 0">
                      ({{
                        ((result.non_consultative_no_count / (result.non_consultative_yes_count +
                          result.non_consultative_no_count + result.non_consultative_neutre_count)) * 100).toFixed(
                            2)
                      }}%)
                    </span>
                    <span class="small" v-else>
                      (0%)
                    </span>
                  </td>
                  <td>
                    {{ result.non_consultative_neutre_count }}

                    <span class="small"
                      v-if="result.non_consultative_neutre_count + result.non_consultative_no_count !== 0">
                      ({{
                        ((result.non_consultative_neutre_count / (result.non_consultative_yes_count +
                          result.non_consultative_no_count + result.non_consultative_neutre_count)) * 100).toFixed(
                            2)
                      }}%)
                    </span>
                    <span class="small" v-else>
                      (0%)
                    </span>
                  </td>
                  <td>{{
                    result.non_consultative_yes_count + result.non_consultative_no_count +
                    result.non_consultative_neutre_count
                    }}
                  </td>
                  <td>{{ result.non_consultative_null_count }}</td>

                  <!-- CONSULTATIVE -->
                  <template v-if="this.hasConsultative()">
                    <td>{{
                      result.consultative_yes_count + result.consultative_no_count + result.consultative_neutre_count +
                      result.consultative_null_count
                      }}
                    </td>
                    <td>
                      {{ result.consultative_yes_count }}

                      <span class="small" v-if="result.consultative_yes_count + result.consultative_no_count !== 0">
                        ({{
                          ((result.consultative_yes_count / (result.consultative_yes_count + result.consultative_no_count
                            +
                            result.consultative_neutre_count)) * 100).toFixed(
                              2)
                        }}%)
                      </span>
                      <span class="small" v-else>
                        (0%)
                      </span>
                    </td>
                    <td>
                      {{ result.consultative_no_count }}

                      <span class="small" v-if="result.consultative_yes_count + result.consultative_no_count !== 0">
                        ({{
                          ((result.consultative_no_count / (result.consultative_yes_count + result.consultative_no_count +
                            result.consultative_neutre_count)) * 100).toFixed(
                              2)
                        }}%)
                      </span>
                      <span class="small" v-else>
                        (0%)
                      </span>
                    </td>
                    <td>
                      {{ result.consultative_neutre_count }}

                      <span class="small" v-if="result.consultative_neutre_count + result.consultative_no_count !== 0">
                        ({{
                          ((result.consultative_neutre_count / (result.consultative_yes_count +
                            result.consultative_no_count
                            + result.consultative_neutre_count)) * 100).toFixed(
                              2)
                        }}%)
                      </span>
                      <span class="small" v-else>
                        (0%)
                      </span>
                    </td>
                    <td>{{
                      result.consultative_yes_count + result.consultative_no_count +
                      result.consultative_neutre_count
                      }}
                    </td>
                    <td>{{ result.consultative_null_count }}</td>
                  </template>
                </tr>
              </tbody>
            </v-table>

            <v-table density="compact" border hover class="text-center">
              <!-- VOTE FREE -->
              <thead v-if="this.editedItem.free_results.length > 0">
                <tr>
                  <th></th>
                  <th colspan="5">Votes comptabilisés</th>
                  <th colspan="5">Votes consultatifs</th>
                </tr>
              </thead>
              <tbody v-if="this.editedItem.free_results.length > 0">
                <tr v-for="result in this.editedItem.free_results" :key="result.id">
                  <th>{{ result.motion_name }}</th>
                  <td colspan="5">{{ result.non_consultative_free }}</td>
                  <td colspan="5">{{ result.consultative_free }}</td>
                </tr>
              </tbody>
            </v-table>

            <v-table v-for="motion in this.editedItem.motions.filter(m => m.kind === 'choices')" :key="motion.id"
              density="compact" class="mb-3 text-center" hover>
              <!-- VOTE CHOICES -->
              <thead>
                <tr>
                  <td :colspan="this.editedItem.choices_results.filter(c => c.id === motion.id).length + 2"
                    class="text-center bg-blue-lighten-5">
                    {{ motion.name }}
                  </td>
                </tr>
                <tr>
                  <th
                    v-if="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 0).length > 0"
                    :colspan="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 0).length + 1"
                    class="bg-blue-lighten-1">Votes comptabilisés
                  </th>
                  <th
                    v-if="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 1).length > 0"
                    :colspan="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 1).length + 1"
                    class="bg-purple-lighten-1">Votes consultatifs
                  </th>
                </tr>

                <tr>
                  <!-- NOT CONSULTATIVE -->
                  <th
                    v-if="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 0).length > 0"
                    class="bg-blue-lighten-2">
                    Voix exprimées
                  </th>
                  <th
                    v-for="choice in this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 0 && c.choice !== null)"
                    class="bg-blue-lighten-3">
                    {{ choice.choice }}
                  </th>
                  <th
                    v-if="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 0).length > 0">
                    Voix non exprimées
                  </th>

                  <!-- CONSULTATIVE -->
                  <th
                    v-if="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 1).length > 0"
                    class="bg-purple-lighten-2">
                    Voix exprimées
                  </th>
                  <th
                    v-for="choice in this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 1 && c.choice !== null)"
                    class="bg-purple-lighten-3">
                    {{ choice.choice }}
                  </th>
                  <th
                    v-if="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 1).length > 0">
                    Voix non exprimées
                  </th>
                </tr>
              </thead>
              <tbody v-if="this.editedItem.choices_results.length > 0">
                <tr>
                  <!-- NOT CONSULTATIVE -->
                  <!-- DISPLAY SUM OF COUNT IN choices_results if choice is not null -->
                  <td
                    v-if="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 0).length > 0">
                    {{
                      this.editedItem.choices_results.filter(
                        c => c.id === motion.id && c.consultative === 0 && c.choice !== null).reduce(
                          (a, b) => a + (b['count'] || 0), 0)
                    }}
                  </td>
                  <td
                    v-for="choice in this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 0 && c.choice !== null)">
                    {{ choice.count }}
                    <!-- Display the percentage of the result in all choices_results with choice different of null -->
                    <span class="small"
                      v-if="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 0 && c.choice !== null).length > 0">
                      ({{
                        ((choice.count / this.editedItem.choices_results.filter(
                          c => c.id === motion.id && c.consultative === 0 && c.choice !== null).reduce(
                            (a, b) => a + (b['count'] || 0),
                            0)) * 100).toFixed(
                              2)
                      }}%)
                    </span>
                  </td>
                  <td
                    v-if="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 0).length > 0">
                    <!-- Check if value exist -->
                    {{
                      (this.editedItem.choices_results.find(
                        c => c.id === motion.id && c.consultative === 0 && c.choice === null) || {}).count || 0
                    }}
                  </td>

                  <!-- CONSULTATIVE -->
                  <td
                    v-if="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 1).length > 0">
                    {{
                      this.editedItem.choices_results.filter(
                        c => c.id === motion.id && c.consultative === 1 && c.choice !== null).reduce(
                          (a, b) => a + (b['count'] || 0), 0)
                    }}
                  </td>
                  <td
                    v-for="choice in this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 1 && c.choice !== null)">
                    {{ choice.count }}
                    <!-- Display the percentage of the result in all choices_results with choice different of null -->
                    <span class="small"
                      v-if="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 1 && c.choice !== null).length > 0">
                      ({{
                        ((choice.count / this.editedItem.choices_results.filter(
                          c => c.id === motion.id && c.consultative === 1 && c.choice !== null).reduce(
                            (a, b) => a + (b['count'] || 0),
                            0)) * 100).toFixed(
                              2)
                      }}%)
                    </span>
                  </td>
                  <td
                    v-if="this.editedItem.choices_results.filter(c => c.id === motion.id && c.consultative === 1).length > 0">
                    <!-- Check if value exist -->
                    {{
                      (this.editedItem.choices_results.find(
                        c => c.id === motion.id && c.consultative === 1 && c.choice === null) || {}).count || 0
                    }}
                  </td>
                </tr>
              </tbody>

            </v-table>

            <v-container class="d-flex justify-center">
              <v-btn color="success" @click="downloadResults()">
                <v-icon>mdi-download</v-icon>
                Télécharger
              </v-btn>
            </v-container>
            <h3>Votants</h3>
            <v-table border hover>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Ville</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="voter in this.editedItem.voters" :key="voter.id">
                  <th>{{ voter.name }}</th>
                  <td>{{ voter.town }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-container>
          <v-container class="justify-content-center" v-else>
            <!-- Display voters count over voters limit -->
            <v-card max-width="300px" class="justify-content-center">
              <v-card-text>
                <h3 class="display-3">
                  {{ this.voterCount }} votants

                  <v-btn prepend-icon="mdi-refresh" color="primary" class="ml-5" @click="updateVotersCount()">
                    Actualiser
                  </v-btn>
                </h3>
              </v-card-text>
            </v-card>
          </v-container>
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-card-actions class="bg-blue-lighten-5">
      <v-spacer></v-spacer>
      <v-btn variant="text" @click="close()">Annuler</v-btn>
      <v-btn color="primary" variant="flat" :loading="saving" @click="save()">Enregistrer la campagne</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import VotingTablesPanel, { duplicateIndexes } from "./VotingTablesPanel.vue";

const POSITION_LABELS = { Eglises: 'Églises', Oeuvres: 'Œuvres' };

export default {
  name: "CampaignForm",
  components: { VotingTablesPanel },
  computed: {
    ...mapGetters('campaignsStore', {
      items: 'getItems',
      item: 'getItem',
      formLoading: 'getFormLoading',
      dialogForm: 'getDialogForm',
      referentiels: 'getReferentiels',
      voterCount: 'getVotersCount',
    }),
    // Résolutions et table des votes ne se modifient plus une fois le vote ouvert
    editable() {
      return this.editedItem.state === 'coming' || !this.editedItem.state;
    },
    getTitle() {
      return (this.editedItem.id === null) ? "Ajouter une campagne" : "Modifier une campagne";
    },
  },
  methods: {
    close() {
      this.$store.commit('campaignsStore/setDialogForm', false);
      this.$store.commit('campaignsStore/setItem', {});
      this.$emit('refresh');
    },
    // Ce qui empêche d'enregistrer, formulé pour l'admin
    validationErrors() {
      const errors = [];
      const item = this.editedItem;
      if (!item.structure_id) errors.push('Choisissez la structure organisatrice.');
      if (!item.name || !item.name.trim()) errors.push('Donnez un nom à la campagne.');
      if (item.motions.length === 0) {
        errors.push('Ajoutez au moins une résolution.');
      } else if (item.motions.some(m => !m.name || !m.name.trim())) {
        errors.push('Chaque résolution doit avoir un intitulé.');
      }
      if (item.motions.some(m => m.kind === 'choices' && (!m.choices || !m.choices.trim()))) {
        errors.push('Indiquez les choix proposés pour chaque résolution à choix multiple.');
      }
      if (item.voting_tables.length === 0) {
        errors.push('Ajoutez au moins une ligne à la table des votes.');
      } else if (item.voting_tables.some(t => !t.position)) {
        errors.push('Choisissez une qualité pour chaque ligne de la table des votes.');
      }
      duplicateIndexes(item.voting_tables).forEach(index => {
        const t = item.voting_tables[index];
        errors.push(`La table des votes contient deux lignes « ${POSITION_LABELS[t.position] || t.position} » pour les ${t.as_member ? 'membres' : 'non-membres'} : supprimez celle en trop.`);
      });
      return errors;
    },
    save() {
      if (this.saving) return;
      this.errors = this.validationErrors();
      if (this.errors.length > 0) {
        this.$root.showSnackbar('La campagne n’est pas complète', 'error');
        return;
      }

      this.saving = true;
      this.$store.dispatch('campaignsStore/save', this.editedItem).then(() => {
        this.$root.showSnackbar('Campagne enregistrée', 'success');
        this.close();
      }, error => {
        const errors = (error.response && error.response.data && error.response.data.errors) || {};
        this.errors = Array.isArray(errors) ? errors : Object.values(errors).flat();
        if (this.errors.length === 0) this.errors = ['La campagne n’a pas pu être enregistrée. Réessayez dans un instant.'];
        this.$root.showSnackbar('La campagne n’a pas été enregistrée', 'error');
      }).finally(() => {
        this.saving = false;
      });
    },
    moveMotionUp(motion) {
      const currentIndex = this.editedItem.motions.findIndex(
        (m) => m.order === motion.order
      );
      if (currentIndex > 0) {
        const previousIndex = currentIndex - 1;
        [this.editedItem.motions[previousIndex], this.editedItem.motions[currentIndex]] =
          [motion, this.editedItem.motions[previousIndex]];
        this.editedItem.motions[currentIndex].order = currentIndex;
        this.editedItem.motions[previousIndex].order = previousIndex;
      }
    },
    moveMotionDown(motion) {
      const currentIndex = this.editedItem.motions.findIndex(
        (m) => m.order === motion.order
      );
      if (currentIndex < this.editedItem.motions.length - 1) {
        const nextIndex = currentIndex + 1;
        [this.editedItem.motions[currentIndex], this.editedItem.motions[nextIndex]] =
          [this.editedItem.motions[nextIndex], motion];
        this.editedItem.motions[currentIndex].order = currentIndex;
        this.editedItem.motions[nextIndex].order = nextIndex;
      }
    },
    addMotion() {
      const newMotion = {
        name: '',
        kind: 'binary',
        max_choice: 1,
        order: this.editedItem.motions.length, // Set the initial order as the length of the motions array
      };

      this.editedItem.motions.push(newMotion);
    },
    removeMotion(motion) {
      const index = this.editedItem.motions.findIndex((m) => m.order === motion.order);
      if (index !== -1) {
        this.editedItem.motions.splice(index, 1);
        this.updateMotionOrder();
      }
    },
    updateMotionOrder() {
      for (let i in this.editedItem.motions) {
        this.editedItem.motions[i].order = parseInt(i);
      }
    },
    // PDF protégé par l'API : téléchargé avec le jeton, puis ouvert dans un nouvel onglet.
    // L'onglet est ouvert tout de suite (clic de l'utilisateur) pour ne pas être bloqué.
    async downloadResults() {
      const tab = window.open('', '_blank');
      try {
        const blob = await this.$store.dispatch('campaignsStore/resultsPdf', this.editedItem.id);
        const url = URL.createObjectURL(blob);
        if (tab) {
          tab.location.href = url;
        } else {
          window.location.href = url;
        }
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      } catch (error) {
        if (tab) tab.close();
        this.$root.showSnackbar('Le PDF des résultats n’a pas pu être généré.', 'error');
      }
    },
    async updateVotersCount() {
      try {
        this.$store.dispatch('campaignsStore/votersCount', this.editedItem.id);
      } catch (error) {
        console.error('API request failed:', error);
      }
    },
    hasConsultative() {
      return this.editedItem.results.some(result =>
        result.consultative_yes_count +
        result.consultative_no_count +
        result.consultative_neutre_count +
        result.consultative_null_count > 0
      );
    },
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler: function () {
        const item = JSON.parse(JSON.stringify(this.item || {}));
        item.motions = item.motions || [];
        item.voting_tables = item.voting_tables || [];
        if (item.id === undefined) item.id = null;
        // Nouvelle campagne : une première résolution prête à remplir
        if (item.id === null && item.motions.length === 0) {
          item.motions.push({ name: '', kind: 'binary', max_choice: 1, order: 0 });
        }
        this.editedItem = item;
        this.errors = [];
        this.updateMotionOrder();
        if (item.id) {
          this.$store.dispatch('campaignsStore/votersCount', item.id).catch(() => {});
        }
      },
    },
  },

  data() {
    return {
      editedItem: {},
      tab: 'motions',
      errors: [],
      saving: false,
      rules: {
        required: value => !!value || 'Champ obligatoire',
        max255: value => !value || value.length <= 255 || 'Maximum 255 caractères',
      },
    };
  },
}
</script>

<style scoped>
.motion {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.motion__number {
  flex: none;
  width: 32px;
  height: 32px;
  margin-top: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.motion__body {
  flex: 1 1 auto;
  min-width: 0;
}

.motion__kind {
  flex-wrap: wrap;
  height: auto !important;
}

.motion__kind :deep(.v-btn) {
  min-height: 40px;
}

.motion__actions {
  flex: none;
  display: flex;
  flex-direction: column;
}

@media (max-width: 599px) {
  .motion__number {
    display: none;
  }
}

.v-table th,
.v-table td {
  text-align: center;
}
</style>