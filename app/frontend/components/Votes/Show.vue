<template>
  <v-container max-width="650px">
    <v-row>
      <v-col cols="12" lg="12">
        <!-- Button to go back to the list -->
        <v-btn color="primary" @click="$router.push({ name: 'votes.index' })" variant="text" size="small" class="mb-5">
          <template v-slot:prepend>
            <v-icon>mdi-arrow-left</v-icon>
          </template>
          <template v-slot:default>
            Retour à la liste
          </template>
        </v-btn>
        <h4 class="text-h5 font-weight-bold mb-4">
          Structure : {{ structure.name }}<br>
          <small>Campagne : {{ item.name }}</small>
        </h4>
      </v-col>
      <v-col cols="12" lg="8">
        <v-card class="mb-5" v-for="motion in editResult" :key="motion.motion_id">
          <v-card-title>
            <small><b>{{ motion.name }}</b></small>
          </v-card-title>
          <v-card-text class="justify-content-center pa-3">

            <v-btn-toggle class="btn-toggle-vote" flat divided elevation="2" border v-model="motion.vote" mandatory
              v-if="motion.kind === 'binary'">
              <v-btn color="primary" value="oui">
                OUI
              </v-btn>
              <v-btn color="primary" value="non">
                NON
              </v-btn>
            </v-btn-toggle>

            <v-btn-toggle class="btn-toggle-vote" flat justify-center divided elevation="2" border v-model="motion.vote"
              mandatory v-else-if="motion.kind === 'neutral'">
              <v-btn color="primary" value="oui">
                OUI
              </v-btn>
              <v-btn color="primary" value="non">
                NON
              </v-btn>
              <v-btn color="primary" value="neutre">
                NEUTRE
              </v-btn>
            </v-btn-toggle>

            <v-btn-toggle class="btn-toggle-vote" flat justify-center divided elevation="2" border v-model="motion.vote"
              :mandatory="motion.max_choice === 1" :multiple="motion.max_choice > 1" :max="motion.max_choice"
              v-else-if="motion.kind === 'choices'">
              <v-btn v-for=" choice in motion.choices.split(',')" color="primary" :value="choice">
                {{ choice }}
              </v-btn>
            </v-btn-toggle>

            <v-text-field v-model="motion.vote" placeholder="Réponse libre" v-else-if="motion.kind === 'free'">
            </v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card class="mb-5">
          <v-list select-strategy="classic">
            <v-list-subheader>Mes bulletins</v-list-subheader>

            <v-card-text v-if="this.present === false">
              <v-alert type="warning">
                <strong>Il semblerait que vous ne soyez pas présent au rassemblement concerné par ce vote.</strong>
              </v-alert>
            </v-card-text>

            <v-list-item v-else v-for="voter in this.editVoters">
              <v-list-item v-if="voter.can_vote === 0">
                <v-alert type="warning">
                  <em>{{ voter.name }} ne peut pas voter. Son vote a été bloqué par les administrateurs de <b>{{
                    structure.name }}</b></em>
                </v-alert>
              </v-list-item>
              <v-list-item-title v-else-if="voter.has_voted === null">
                <v-checkbox v-model="voter.selected">
                  <template v-slot:label>
                    {{ voter.name }}&nbsp;
                    <small v-if="voter.is_consultative === 1">(Vote consultatif)</small>
                    <small v-if="voter.is_consultative === 0">(Vote comptabilisé)</small>
                  </template>
                </v-checkbox>
              </v-list-item-title>
              <v-list-item-title v-else>
                <em>{{ voter.name }} a déjà voté</em>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

      </v-col>
      <v-col cols="12" lg="12">
        <v-btn block color="primary" @click="goVote()">
          <template v-slot:prepend>
            <v-icon>mdi-alert</v-icon>
          </template>
          <template v-slot:default>
            Soumettre mon vote
          </template>
          <template v-slot:append>
            <v-icon>mdi-alert</v-icon>
          </template>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
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
    goVote() {
      // check if there is at least one voter selected
      if (this.editVoters.filter(voter => voter.selected === true).length === 0) {
        this.$root.showSnackbar('Vous devez sélectionner au moins un bulletin de vote', 'error');
        return;
      }

      // warning all result in ResultsEdit is empty
      if (this.editResult.filter(motion => motion.vote === null).length > 0 && this.confirmValid === false) {
        // display confirmation dialog
        this.$root.showSnackbar(
          'Vous n\'avez pas répondu à toutes les questions ! Une fois validé vous ne pourrez plus modifier votre vote. Cliquez à nouveau pour valider',
          'warning');
        this.confirmValid = true;
        return;
      }

      this.$store.dispatch('votesStore/vote', {
        campaign_id: this.$route.params.id,
        results: this.editResult,
        voters: this.editVoters
      }).then(response => {
        this.$root.showSnackbar('Vote pris en compte avec succès', 'success');
        this.$router.push({ name: 'votes.index' });
      }, error => {
        this.$root.showSnackbar('Un probleme est survenu lors de l\'enregistrement de votre vote', 'error');
      });
    },
  },
  data: () => ({
    confirmValid: false,
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
  display: flex;
  flex-direction: column;
}

html .v-btn-toggle>.v-btn {
  height: 48px !important;
  border: none !important;
  border-bottom: solid 1px #ccc !important;
}

html .v-btn-toggle>.v-btn:last-child {
  border-bottom: none !important;
}
</style>