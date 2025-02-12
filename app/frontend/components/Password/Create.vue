<template>
  <v-row justify="center">
    <v-col cols="12" lg="6" md="8" sm="12">
      <v-card>
        <v-form @submit.prevent="password_reset">
          <v-card-text>
            <v-text-field
                v-model="password"
                :type="(togglePassword) ? 'text' : 'password'"
                label="Mot de passe"
                :rules="[
                  v => !!v || 'Le mot de passe est requis',
                  v => (v && v.length >= 6) || 'Le mot de passe doit contenir au moins 8 caractères',
                ]"
            >
              <template v-slot:append>
                <v-icon v-if="!togglePassword" @click="togglePassword = !togglePassword">mdi-eye</v-icon>
                <v-icon v-else @click="togglePassword = !togglePassword">mdi-eye-off</v-icon>
              </template>
            </v-text-field>

            <v-text-field
                v-model="password_confirmation"
                class="mb-4"
                :type="(togglePassword) ? 'text' : 'password'"
                label="Confirmation du mot de passe"
                :rules="[
                  v => !!v || 'Le mot de passe est requis',
                  v => (v && v.length >= 6) || 'Le mot de passe doit contenir au moins 8 caractères',
                  v => (v && v === password) || 'Les mots de passe ne correspondent pas',
                ]">
              <template v-slot:append>
                <v-icon v-if="!togglePassword" @click="togglePassword = !togglePassword">mdi-eye</v-icon>
                <v-icon v-else @click="togglePassword = !togglePassword">mdi-eye-off</v-icon>
              </template>
            </v-text-field>

            <v-btn type="submit" color="primary" block size="large" variant="flat" prepend-icon="mdi-lock" class="my-4">
              Réinitialiser mon mot de passe
            </v-btn>
          </v-card-text>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: 'createPassword',
  data() {
    return {
      password:              '',
      password_confirmation: '',
      togglePassword:        false,
    };
  },
  methods: {
    password_reset() {
      // rules :
      // - password and password_confirmation must be at least 8 characters long
      if (this.password.length < 6) {
        this.$root.showSnackbar("Le mot de passe doit contenir au moins 6 caractères", 'error');
        return;
      }

      //check if password and password_confirmation are the same
      if (this.password !== this.password_confirmation) {
        this.$root.showSnackbar("Les mots de passe ne correspondent pas", 'error');
        return;
      }

      this.$store.dispatch('sessionStore/password_reset', {
        password:              this.password,
        password_confirmation: this.password_confirmation,
        reset_password_token:  this.$route.query.reset_password_token,
      }).then(response => {
        this.$root.showSnackbar("Votre mot de passe a été modifié", 'success');
        this.$router.push('/connexion');
      }).catch((error) => {
        this.$root.showSnackbar("Identifiant incorrect", 'error');
      });
    },
  },
}
</script>

<style scoped>

</style>