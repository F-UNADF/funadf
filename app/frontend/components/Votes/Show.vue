<template>
  <div class="reading-width vote">
    <v-btn color="primary" prepend-icon="mdi-arrow-left" @click="$router.push({ name: 'votes.index' })" variant="text"
      class="mb-3 px-2">
      Retour aux votes
    </v-btn>

    <header class="mb-6">
      <p class="text-body-2 text-medium-emphasis mb-1">{{ structure.name }}</p>
      <h2 class="text-h5 font-weight-bold">{{ item.name }}</h2>
    </header>

    <!-- 1. Pour qui je vote -->
    <v-card class="mb-6" variant="outlined">
      <v-card-item>
        <v-card-title class="text-subtitle-1 font-weight-bold">Mes bulletins</v-card-title>
        <v-card-subtitle v-if="this.present !== false">Cochez les bulletins à utiliser pour ce vote.</v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-alert v-if="this.present === false" type="warning" variant="tonal">
          Vous n’êtes pas indiqué comme présent au rassemblement concerné par ce vote.
        </v-alert>

        <template v-else>
          <div v-for="voter in this.editVoters" :key="voter.id || voter.name" class="vote__voter">
            <v-alert v-if="voter.can_vote === 0" type="warning" variant="tonal" density="compact">
              {{ voter.name }} ne peut pas voter : son vote a été bloqué par les administrateurs de
              <strong>{{ structure.name }}</strong>.
            </v-alert>
            <v-checkbox v-else-if="voter.has_voted === null" v-model="voter.selected" hide-details color="primary">
              <template v-slot:label>
                <span>
                  {{ voter.name }}
                  <span v-if="voter.is_consultative === 1" class="text-medium-emphasis">(vote consultatif)</span>
                  <span v-if="voter.is_consultative === 0" class="text-medium-emphasis">(vote comptabilisé)</span>
                </span>
              </template>
            </v-checkbox>
            <div v-else class="d-flex align-center py-2 text-body-1">
              <v-icon color="success" class="me-2">mdi-check-circle</v-icon>
              {{ voter.name }} a déjà voté
            </div>
          </div>
        </template>
      </v-card-text>
    </v-card>

    <!-- 2. Les questions -->
    <h3 class="text-subtitle-1 font-weight-bold mb-3">Questions ({{ editResult.length }})</h3>
    <v-card class="mb-4" v-for="(motion, index) in editResult" :key="motion.motion_id">
      <v-card-item>
        <v-card-title class="text-body-1 font-weight-bold text-wrap">{{ index + 1 }}. {{ motion.name }}</v-card-title>
        <v-card-subtitle v-if="motion.kind === 'choices' && motion.max_choice > 1">
          Jusqu’à {{ motion.max_choice }} choix
        </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-btn-toggle class="btn-toggle-vote" divided border v-model="motion.vote" color="primary"
          mandatory v-if="motion.kind === 'binary'" :aria-label="motion.name">
          <v-btn value="oui">Oui</v-btn>
          <v-btn value="non">Non</v-btn>
        </v-btn-toggle>

        <v-btn-toggle class="btn-toggle-vote" divided border v-model="motion.vote" color="primary"
          mandatory v-else-if="motion.kind === 'neutral'" :aria-label="motion.name">
          <v-btn value="oui">Oui</v-btn>
          <v-btn value="non">Non</v-btn>
          <v-btn value="neutre">Neutre</v-btn>
        </v-btn-toggle>

        <v-btn-toggle class="btn-toggle-vote" divided border v-model="motion.vote" color="primary"
          :mandatory="motion.max_choice === 1" :multiple="motion.max_choice > 1" :max="motion.max_choice"
          v-else-if="motion.kind === 'choices'" :aria-label="motion.name">
          <v-btn v-for="choice in motion.choices.split(',')" :key="choice" :value="choice">
            {{ choice }}
          </v-btn>
        </v-btn-toggle>

        <v-text-field v-model="motion.vote" label="Votre réponse" v-else-if="motion.kind === 'free'"
          hide-details="auto"></v-text-field>
      </v-card-text>
    </v-card>

    <v-btn block size="large" color="primary" variant="flat" class="mt-6" :disabled="!canSubmit" @click="askConfirm()">
      Voter
    </v-btn>
    <p v-if="!canSubmit && this.present !== false" class="text-body-2 text-medium-emphasis text-center mt-2">
      {{ selectableVoters.length === 0 ? 'Aucun bulletin disponible : tous vos bulletins ont déjà été utilisés.' : 'Cochez au moins un bulletin pour voter.' }}
    </p>

    <!-- Confirmation : le vote est définitif -->
    <v-dialog v-model="confirmDialog" max-width="480">
      <v-card title="Confirmer votre vote">
        <v-card-text>
          <p class="mb-3">
            Vous allez voter avec {{ selectedCount }} bulletin{{ selectedCount > 1 ? 's' : '' }}.
            <strong>Une fois validé, le vote ne peut plus être modifié.</strong>
          </p>
          <v-alert v-if="unansweredCount > 0" type="warning" variant="tonal" density="compact">
            {{ unansweredCount }} question{{ unansweredCount > 1 ? 's sont restées' : ' est restée' }} sans réponse.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="confirmDialog = false">Revenir au vote</v-btn>
          <v-btn color="primary" variant="flat" :loading="submitting" @click="goVote()">Confirmer mon vote</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "VotesShow",
  computed: {
    ...mapGetters('votesStore', {
      item: 'getItem',
      structure: 'getStructure',
      motions: 'getMotions',
      voters: 'getVoters',
      loading: 'getLoading',
      present: 'getPresent',
      results: 'getResults',
    }),
    selectableVoters() {
      return this.editVoters.filter(voter => voter.can_vote !== 0 && voter.has_voted === null);
    },
    selectedCount() {
      return this.editVoters.filter(voter => voter.selected === true).length;
    },
    unansweredCount() {
      return this.editResult.filter(motion => motion.vote === null || motion.vote === undefined
        || motion.vote === '' || (Array.isArray(motion.vote) && motion.vote.length === 0)).length;
    },
    canSubmit() {
      return this.present !== false && this.selectedCount > 0;
    },

  },
  watch: {
    results: {
      handler: function () {
        this.editResult = [];
        this.editResult = JSON.parse(JSON.stringify(this.results));
      },
      deep: true,
    },
    voters: {
      handler: function () {
        this.editVoters = [];
        this.editVoters = JSON.parse(JSON.stringify(this.voters));
        this.editVoters.forEach(voter => {
          voter.selected = false;
        });
      },
      deep: true,
    },
  },
  methods: {
    askConfirm() {
      if (this.selectedCount === 0) {
        this.$root.showSnackbar('Cochez au moins un bulletin pour voter.', 'error');
        return;
      }
      this.confirmDialog = true;
    },
    goVote() {
      if (this.submitting) {
        return;
      }
      this.submitting = true;
      this.$store.dispatch('votesStore/vote', {
        campaign_id: this.$route.params.id,
        results: this.editResult,
        voters: this.editVoters
      }).then(response => {
        this.confirmDialog = false;
        this.$root.showSnackbar('Votre vote est enregistré.', 'success');
        this.$router.push({ name: 'votes.index' });
      }, error => {
        this.$root.showSnackbar('Votre vote n’a pas pu être enregistré. Réessayez dans un instant.', 'error');
      }).finally(() => {
        this.submitting = false;
      });
    },
  },
  data: () => ({
    confirmDialog: false,
    submitting: false,
    editResult: [],
    editVoters: [],
  }),
  beforeMount: function () {
    this.$store.dispatch('votesStore/item', this.$route.params.id);
  },
}
</script>

<style scoped>
.v-btn-toggle {
  height: auto !important;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.v-btn-toggle > .v-btn {
  height: 48px !important;
  justify-content: flex-start;
}

.vote__voter + .vote__voter {
  border-top: 1px solid rgb(var(--v-theme-border));
}
</style>
