<template>
  <v-container class="d-flex flex-column align-center justify-center" style="min-height: 60vh">
    <template v-if="error">
      <v-icon size="48" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
      <p class="text-body-1 mb-4">{{ error }}</p>
      <v-btn color="primary" @click="redirectToArchivate">Réessayer</v-btn>
    </template>
    <template v-else>
      <v-progress-circular color="primary" indeterminate :size="56" :width="6" class="mb-4" />
      <p class="text-body-1">Connexion à Archivate…</p>
    </template>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "ArchivateRedirect",
  data: () => ({
    error: null,
  }),
  methods: {
    // Génère un jeton SSO à usage unique côté funadf puis redirige l'utilisateur
    // vers Archivate, qui l'échangera et ouvrira automatiquement sa session.
    redirectToArchivate() {
      this.error = null;
      axios
        .post("/api/archivate/sso/generate")
        .then((res) => {
          window.location.href = res.data.redirect_url;
        })
        .catch(() => {
          this.error = "Impossible d'ouvrir Archivate pour le moment.";
        });
    },
  },
  mounted() {
    this.redirectToArchivate();
  },
};
</script>
