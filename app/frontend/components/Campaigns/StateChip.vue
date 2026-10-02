<template>
  <!-- Statut d'une campagne : libellé + pastille de couleur (l'information ne repose pas sur la seule couleur) -->
  <v-chip size="small" variant="outlined" class="state-chip">
    <v-icon start size="10" :color="color">mdi-circle</v-icon>
    {{ label }}
  </v-chip>
</template>

<script>
const STATES = {
  coming: { label: "À venir", color: "warning" },
  opened: { label: "Vote ouvert", color: "success" },
  closed: { label: "Clôturé", color: "error" },
};

export default {
  name: "CampaignStateChip",
  props: {
    state: {
      type: String,
      default: null,
    },
  },
  computed: {
    label() {
      return STATES[this.state]?.label || this.state || "—";
    },
    color() {
      return STATES[this.state]?.color || "grey";
    },
  },
};
</script>

<style scoped>
.state-chip {
  border-color: rgb(var(--v-theme-border));
}
</style>
