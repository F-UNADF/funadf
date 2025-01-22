<template>
  <v-row justify="center">
    <v-col cols="12" lg="6" md="8" sm="12">
      <v-card>
        <v-form @submit.prevent="password_recovery">
          <v-card-text>
            <v-text-field v-model="email" label="Email"></v-text-field>

            <v-btn type="submit" color="primary" block size="large" variant="flat" prepend-icon="mdi-lock" class="mb-4">
              Récuperer mon mot de passe
            </v-btn>
          </v-card-text>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
    };
  },
  methods: {
    password_recovery() {
      this.$store.dispatch('sessionStore/password_recovery', {
        email: this.email,
      }).then(response => {
        this.$root.showSnackbar("Un email vous a été envoyé", 'success');
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