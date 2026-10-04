<template>
  <v-card class="pa-2" rounded="lg">
    <v-card-item>
      <h1 class="text-h5 font-weight-bold">Connexion</h1>
      <p class="text-body-2 text-medium-emphasis mt-1">Intranet des Assemblées de Dieu de France</p>
    </v-card-item>

    <v-form @submit.prevent="login">
      <v-card-text>
        <v-text-field v-model="email" label="Adresse e-mail" type="email" autocomplete="username" inputmode="email"
          prepend-inner-icon="mdi-email-outline" class="mb-2" :error="!!errorMessage"></v-text-field>

        <v-text-field v-model="password" :type="togglePassword ? 'text' : 'password'" label="Mot de passe"
          autocomplete="current-password" prepend-inner-icon="mdi-lock-outline" :error="!!errorMessage">
          <template v-slot:append-inner>
            <v-btn :icon="togglePassword ? 'mdi-eye-off' : 'mdi-eye'" variant="text" size="small" density="comfortable"
              :aria-label="togglePassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              :aria-pressed="togglePassword" @click="togglePassword = !togglePassword"></v-btn>
          </template>
        </v-text-field>

        <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="mb-4" role="alert">
          {{ errorMessage }}
        </v-alert>

        <v-btn type="submit" color="primary" block size="large" variant="flat" :loading="loading" class="mb-2">
          Se connecter
        </v-btn>
        <v-btn to="/mot-de-passe-oublie" color="primary" block variant="text">
          Mot de passe oublié ?
        </v-btn>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      togglePassword: false,
      loading: false,
      errorMessage: '',
    };
  },
  methods: {
    login() {
      if (this.loading) {
        return;
      }
      if (!this.email || !this.password) {
        this.errorMessage = "Saisissez votre adresse e-mail et votre mot de passe.";
        return;
      }
      this.errorMessage = '';
      this.loading = true;
      this.$store.dispatch('sessionStore/login', {
        email: this.email,
        password: this.password,
      }).then(response => {
        this.$router.push(response.data.redirect);
      }).catch(() => {
        this.errorMessage = "Adresse e-mail ou mot de passe incorrect. Vérifiez votre saisie ou réinitialisez votre mot de passe.";
      }).finally(() => {
        this.loading = false;
      });
    },
  },
}
</script>
