<template>
  <v-card class="pa-2" rounded="lg">
    <v-card-item>
      <h1 class="text-h5 font-weight-bold">Mot de passe oublié</h1>
      <p class="text-body-2 text-medium-emphasis mt-1">
        Saisissez l’adresse e-mail de votre compte. Vous recevrez un lien pour choisir un nouveau mot de passe.
      </p>
    </v-card-item>

    <v-form @submit.prevent="password_recovery">
      <v-card-text>
        <v-text-field v-model="email" label="Adresse e-mail" type="email" autocomplete="username" inputmode="email"
          prepend-inner-icon="mdi-email-outline" :error-messages="errorMessage"></v-text-field>

        <v-btn type="submit" color="primary" block size="large" variant="flat" :loading="loading" class="mt-2 mb-2">
          Recevoir le lien
        </v-btn>
        <v-btn to="/connexion" color="primary" block variant="text" prepend-icon="mdi-arrow-left">
          Retour à la connexion
        </v-btn>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script>

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      loading: false,
      errorMessage: '',
    };
  },
  methods: {
    password_recovery() {
      if (this.loading) {
        return;
      }
      if (!this.email) {
        this.errorMessage = "Saisissez votre adresse e-mail.";
        return;
      }
      this.errorMessage = '';
      this.loading = true;
      this.$store.dispatch('sessionStore/password_recovery', {
        email: this.email,
      }).then(() => {
        this.$root.showSnackbar("Un e-mail vient de vous être envoyé. Suivez le lien qu’il contient pour choisir un nouveau mot de passe.", 'success');
        this.$router.push('/connexion');
      }).catch(() => {
        this.errorMessage = "Aucun compte ne correspond à cette adresse e-mail. Vérifiez votre saisie.";
      }).finally(() => {
        this.loading = false;
      });
    },
  },
}
</script>
