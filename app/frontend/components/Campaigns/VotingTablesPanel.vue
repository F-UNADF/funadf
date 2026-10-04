<template>
  <div class="vt-panel">
    <div class="vt-panel__main">
      <!-- Estimation : mise à jour à chaque changement de la table -->
      <v-card variant="tonal" color="primary" class="estimate mb-6" aria-live="polite">
        <v-progress-linear v-if="loading" indeterminate color="primary" height="2" absolute></v-progress-linear>
        <v-card-text>
          <p v-if="!structureId" class="estimate__text">
            Choisissez la structure organisatrice pour estimer le nombre de votants.
          </p>
          <p v-else-if="votingTables.length === 0" class="estimate__text">
            Ajoutez une ligne pour indiquer qui vote.
          </p>
          <p v-else-if="error" class="estimate__text">
            L’estimation n’a pas pu être calculée.
            <v-btn variant="text" size="small" color="primary" @click="fetchElectorate()">Réessayer</v-btn>
          </p>
          <template v-else-if="estimate">
            <p class="estimate__text" data-test="estimate">
              En l’état, vous aurez au plus
              <strong>{{ count(estimate.count, 'votant comptabilisé', 'votants comptabilisés') }}</strong>
              et
              <strong>{{ count(estimate.consultative, 'votant consultatif', 'votants consultatifs') }}</strong>.
            </p>
            <p class="estimate__note">
              C’est un maximum : seuls les bulletins utilisés compteront (absences, abstentions).
              <template v-if="estimate.blocked > 0">
                {{ count(estimate.blocked, 'bulletin bloqué', 'bulletins bloqués') }} par la structure
                {{ estimate.blocked > 1 ? 'n’y sont pas comptés' : 'n’y est pas compté' }}.
              </template>
            </p>
            <p v-if="estimate.count === 0 && votingTables.every(t => t.position)" class="estimate__note font-weight-medium">
              Aucun vote comptabilisé : les résultats officiels seront vides.
            </p>
          </template>
          <v-skeleton-loader v-else type="paragraph" color="transparent"></v-skeleton-loader>
        </v-card-text>
      </v-card>

      <h3 class="text-subtitle-1 font-weight-medium mb-1">Qui vote ?</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        Une ligne par qualité : précisez si elle vise les membres de la structure organisatrice ou les
        non-membres, et si leur vote est comptabilisé ou seulement consultatif. Pour les églises et les
        œuvres, c’est le président qui vote au nom de la structure.
      </p>

      <div v-for="(line, index) in votingTables" :key="index" class="vt-line" data-test="voting-line">
        <v-select v-model="line.position" :items="positionItems" label="Qualité" density="comfortable"
          hide-details class="vt-line__position" :disabled="disabled"></v-select>
        <v-btn-toggle v-model="line.as_member" mandatory divided variant="outlined" color="primary"
          density="comfortable" :disabled="disabled" class="vt-line__toggle">
          <v-btn :value="true">Membres</v-btn>
          <v-btn :value="false">Non-membres</v-btn>
        </v-btn-toggle>
        <v-btn-toggle v-model="line.voting" mandatory divided variant="outlined" color="primary"
          density="comfortable" :disabled="disabled" class="vt-line__toggle">
          <v-btn value="count">Comptabilisé</v-btn>
          <v-btn value="consultative">Consultatif</v-btn>
        </v-btn-toggle>
        <div class="vt-line__count" data-test="line-count">
          <template v-if="isDuplicate(index)">—</template>
          <template v-else-if="lineEstimate(index)">
            <span class="font-weight-medium">{{ count(lineEstimate(index).voters, 'votant', 'votants') }}</span>
            <span v-if="lineEstimate(index).blocked > 0" class="d-block text-caption">
              + {{ count(lineEstimate(index).blocked, 'bloqué', 'bloqués') }}
            </span>
          </template>
        </div>
        <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" :disabled="disabled"
          :aria-label="`Supprimer la ligne ${index + 1}`" @click="removeLine(index)"></v-btn>
        <p v-if="isDuplicate(index)" class="vt-line__warning">
          Cette qualité est déjà réglée plus haut pour les {{ line.as_member ? 'membres' : 'non-membres' }} :
          cette ligne ne sera pas appliquée.
        </p>
      </div>

      <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" :disabled="disabled" @click="addLine()">
        Ajouter une ligne
      </v-btn>
    </div>

    <!-- Membres directs de la structure organisatrice -->
    <aside class="vt-panel__aside">
      <v-card variant="outlined" class="members" data-test="members">
        <v-card-item>
          <v-card-title class="text-subtitle-1 font-weight-medium text-wrap">
            {{ electorate ? `Membres de ${electorate.structure.name}` : 'Membres de la structure' }}
          </v-card-title>
          <v-card-subtitle v-if="members" class="text-wrap">
            {{ count(members.total, 'membre direct', 'membres directs') }}
          </v-card-subtitle>
        </v-card-item>
        <v-card-text>
          <p v-if="!structureId" class="text-body-2 text-medium-emphasis">
            Aucune structure choisie pour l’instant.
          </p>
          <v-skeleton-loader v-else-if="!members && !error" type="list-item@4"></v-skeleton-loader>
          <p v-else-if="!members" class="text-body-2 text-medium-emphasis">Membres indisponibles.</p>
          <template v-else>
            <dl class="members__list">
              <div class="members__row">
                <dt>Pasteurs</dt>
                <dd>{{ fmt(members.pastors.total) }}</dd>
              </div>
              <div v-for="level in members.pastors.by_level" :key="level.level" class="members__row members__row--sub">
                <dt>{{ levelLabel(level.level) }}</dt>
                <dd>{{ fmt(level.count) }}</dd>
              </div>
              <div class="members__row">
                <dt>Églises</dt>
                <dd>{{ fmt(members.churches.total) }}</dd>
              </div>
              <div v-if="members.churches.without_president > 0" class="members__row members__row--sub">
                <dt>dont sans président</dt>
                <dd>{{ fmt(members.churches.without_president) }}</dd>
              </div>
              <div class="members__row">
                <dt>Œuvres</dt>
                <dd>{{ fmt(members.oeuvres.total) }}</dd>
              </div>
              <div v-if="members.oeuvres.without_president > 0" class="members__row members__row--sub">
                <dt>dont sans président</dt>
                <dd>{{ fmt(members.oeuvres.without_president) }}</dd>
              </div>
              <div v-if="members.others > 0" class="members__row">
                <dt>Autres structures</dt>
                <dd>{{ fmt(members.others) }}</dd>
              </div>
            </dl>

            <ul v-if="warnings.length" class="members__warnings">
              <li v-for="warning in warnings" :key="warning">
                <v-icon icon="mdi-alert-outline" size="small" color="warning" class="mr-1"></v-icon>{{ warning }}
              </li>
            </ul>

            <p class="text-caption text-medium-emphasis mt-4">
              Les non-membres sont le reste du réseau : les pasteurs actifs non adhérents, et les églises
              ou œuvres non adhérentes qui ont un président.
            </p>
          </template>
        </v-card-text>
      </v-card>
    </aside>
  </div>
</template>

<script>
const POSITION_LABELS = { Eglises: 'Églises', Oeuvres: 'Œuvres' };

// Même comparaison que le serveur (Campaign.same_position?) : casse et espaces finaux ignorés
const samePosition = (a, b) => !!a && !!b && a.trimEnd().toLowerCase() === b.trimEnd().toLowerCase();

export function duplicateIndexes(lines) {
  return (lines || []).reduce((indexes, line, index) => {
    if (lines.slice(0, index).some(other => other.as_member === line.as_member && samePosition(other.position, line.position))) {
      indexes.push(index);
    }
    return indexes;
  }, []);
}

export default {
  name: "VotingTablesPanel",
  props: {
    votingTables: { type: Array, required: true },
    structureId: { type: [Number, String], default: null },
    positions: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    // Délai avant de recalculer l'estimation (ms), pour ne pas appeler l'API à chaque clic
    delay: { type: Number, default: 400 },
  },
  data() {
    return {
      electorate: null,
      loading: false,
      error: false,
      requestId: 0,
      timer: null,
    };
  },
  computed: {
    members() {
      return this.electorate ? this.electorate.members : null;
    },
    estimate() {
      return this.electorate ? this.electorate.estimate : null;
    },
    positionItems() {
      return this.positions.map(position => ({ value: position, title: POSITION_LABELS[position] || position }));
    },
    duplicates() {
      return duplicateIndexes(this.votingTables);
    },
    warnings() {
      const m = this.members;
      const warnings = [];
      const withoutPresident = m.churches.without_president + m.oeuvres.without_president;
      if (withoutPresident > 0) {
        warnings.push(`${this.count(withoutPresident, 'église ou œuvre membre n’a', 'églises ou œuvres membres n’ont')} pas de président : ${withoutPresident > 1 ? 'elles ne pourront' : 'elle ne pourra'} pas voter.`);
      }
      if (m.blocked > 0) {
        warnings.push(`${this.count(m.blocked, 'adhésion bloquée', 'adhésions bloquées')} : ${m.blocked > 1 ? 'ces membres verront leur bulletin mais ne pourront' : 'ce membre verra son bulletin mais ne pourra'} pas voter.`);
      }
      if (m.pastors.disabled > 0) {
        warnings.push(`${this.count(m.pastors.disabled, 'compte désactivé ne votera', 'comptes désactivés ne voteront')} pas.`);
      }
      return warnings;
    },
  },
  watch: {
    structureId: {
      immediate: true,
      handler() {
        this.electorate = null;
        this.fetchElectorate();
      },
    },
    votingTables: {
      deep: true,
      handler() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.fetchElectorate(), this.delay);
      },
    },
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  methods: {
    fetchElectorate() {
      clearTimeout(this.timer);
      if (!this.structureId) {
        this.electorate = null;
        return;
      }
      const requestId = ++this.requestId;
      this.loading = true;
      this.error = false;
      this.$store.dispatch('campaignsStore/electorate', {
        structure_id: this.structureId,
        voting_tables: this.votingTables,
      }).then(data => {
        if (requestId === this.requestId) this.electorate = data;
      }).catch(() => {
        if (requestId === this.requestId) this.error = true;
      }).finally(() => {
        if (requestId === this.requestId) this.loading = false;
      });
    },
    // Estimation d'une ligne, si elle correspond encore à la table affichée
    lineEstimate(index) {
      if (!this.estimate || this.estimate.lines.length !== this.votingTables.length) return null;
      const line = this.votingTables[index];
      return line.position ? this.estimate.lines[index] : null;
    },
    isDuplicate(index) {
      return this.duplicates.includes(index);
    },
    addLine() {
      this.votingTables.push({ position: null, as_member: true, voting: 'count' });
    },
    removeLine(index) {
      this.votingTables.splice(index, 1);
    },
    levelLabel(level) {
      return level === 'Non renseigné' ? 'Sans reconnaissance' : level;
    },
    fmt(n) {
      return Number(n || 0).toLocaleString('fr-FR');
    },
    count(n, one, many) {
      return `${this.fmt(n)} ${n > 1 ? many : one}`;
    },
  },
};
</script>

<style scoped>
.vt-panel {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
  gap: 24px;
  align-items: start;
}

.vt-panel__aside {
  position: sticky;
  top: 16px;
}

@media (max-width: 959px) {
  .vt-panel {
    grid-template-columns: minmax(0, 1fr);
  }

  .vt-panel__aside {
    position: static;
  }
}

.estimate {
  position: relative;
}

.estimate__text {
  font-size: 1.125rem;
  line-height: 1.5;
  color: rgb(var(--v-theme-on-surface));
}

.estimate__note {
  margin-top: 6px;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.vt-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.vt-line:last-of-type {
  margin-bottom: 16px;
}

.vt-line__position {
  flex: 1 1 200px;
  min-width: 180px;
}

.vt-line__toggle {
  flex: none;
}

.vt-line__count {
  flex: 0 0 7rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.vt-line__warning {
  flex: 1 0 100%;
  font-size: 0.875rem;
  color: rgb(var(--v-theme-error));
}

.members__list {
  margin: 0;
}

.members__row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  font-weight: 500;
}

.members__row--sub {
  padding: 2px 0 2px 16px;
  font-weight: 400;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.members__row dd {
  font-variant-numeric: tabular-nums;
}

.members__warnings {
  list-style: none;
  margin-top: 12px;
  padding: 0;
  font-size: 0.875rem;
}

.members__warnings li {
  padding: 4px 0;
}

@media (max-width: 599px) {
  .vt-line__toggle {
    flex: 1 1 100%;
  }

  .vt-line__toggle .v-btn {
    flex: 1 1 50%;
  }

  .vt-line__count {
    flex: 1 1 auto;
    text-align: left;
  }
}
</style>
