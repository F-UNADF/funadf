<template>
  <v-row justify="center">
    <v-col cols="12" lg="6" md="8" sm="12">
      <v-card>
        <v-form fast-fail @submit.prevent="login">
          <v-card-text>
            <v-text-field v-model="email" label="Email"></v-text-field>

            <v-text-field v-model="password" :type="(togglePassword) ? 'text' : 'password'" label="Mot de passe">
              <template v-slot:append>
                <v-icon v-if="!togglePassword" @click="togglePassword = !togglePassword">mdi-eye</v-icon>
                <v-icon v-else @click="togglePassword = !togglePassword">mdi-eye-off</v-icon>
              </template>
            </v-text-field>

            <v-btn type="submit" color="primary" block size="large" variant="flat" prepend-icon="mdi-lock"
                   class="my-2">
              Se connecter
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="" color="secondary" block size="default" variant="flat"
                   prepend-icon="mdi-question-mark">
              J'ai oublié mon mot de passe...
            </v-btn>

            <a href="#" class="text-body-2 font-weight-regular"></a>
          </v-card-text>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      email:          '',
      password:       '',
      togglePassword: false,
    };
  },
  methods: {
    login() {
      this.$store.dispatch('sessionStore/login', {
        email:    this.email,
        password: this.password,
      }).then(response => {
        this.$root.showSnackbar("Vous êtes connecté", 'success');
        this.$router.push(response.data.redirect);
      }).catch((error) => {
        this.$root.showSnackbar("Identifiant incorrect", 'error');
      });
    },
  },
}
</script>

<style scoped>

</style>