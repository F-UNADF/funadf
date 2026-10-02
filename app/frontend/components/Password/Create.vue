<template>
  <v-card class="pa-2" rounded="lg">
    <v-card-item>
      <h1 class="text-h5 font-weight-bold">Choisir un mot de passe</h1>
      <p class="text-body-2 text-medium-emphasis mt-1">Au moins 6 caractères.</p>
    </v-card-item>

    <v-form ref="form" @submit.prevent="password_reset" validate-on="blur lazy">
      <v-card-text>
        <v-text-field
            v-model="password"
            :type="togglePassword ? 'text' : 'password'"
            label="Nouveau mot de passe"
            autocomplete="new-password"
            prepend-inner-icon="mdi-lock-outline"
            class="mb-2"
            :rules="[
              v => !!v || 'Saisissez un mot de passe.',
              v => (v && v.length >= 6) || 'Le mot de passe doit contenir au moins 6 caractères.',
            ]"
        >
          <template v-slot:append-inner>
            <v-btn :icon="togglePassword ? 'mdi-eye-off' : 'mdi-eye'" variant="text" size="small" density="comfortable"
              :aria-label="togglePassword ? 'Masquer les mots de passe' : 'Afficher les mots de passe'"
              :aria-pressed="togglePassword" @click="togglePassword = !togglePassword"></v-btn>
          </template>
        </v-text-field>

        <v-text-field
            v-model="password_confirmation"
            :type="togglePassword ? 'text' : 'password'"
            label="Confirmer le mot de passe"
            autocomplete="new-password"
            prepend-inner-icon="mdi-lock-check-outline"
            :rules="[
              v => !!v || 'Confirmez le mot de passe.',
              v => (v && v === password) || 'Les deux mots de passe ne sont pas identiques.',
            ]">
        </v-text-field>

        <v-btn type="submit" color="primary" block size="large" variant="flat" :loading="loading" class="mt-4">
          Enregistrer le mot de passe
        </v-btn>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script>

export default {
  name: 'createPassword',
  data() {
    return {
      password:              '',
      password_confirmation: '',
      togglePassword:        false,
      loading:               false,
    };
  },
  methods: {
    async password_reset() {
      if (this.loading) {
        return;
      }
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      this.loading = true;

      this.$store.dispatch('sessionStore/password_reset', {
        password:              this.password,
        password_confirmation: this.password_confirmation,
        reset_password_token:  this.$route.query.reset_password_token,
      }).then(response => {
        this.$root.showSnackbar("Votre mot de passe est enregistré. Vous pouvez vous connecter.", 'success');
        this.$router.push('/connexion');
      }).catch(() => {
        this.$root.showSnackbar("Le mot de passe n’a pas pu être enregistré. Le lien a peut-être expiré : demandez-en un nouveau depuis « Mot de passe oublié ».", 'error');
      }).finally(() => {
        this.loading = false;
      });
    },
  },
}
</script>

<style scoped>

</style>