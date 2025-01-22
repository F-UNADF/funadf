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


            <v-btn type="submit" color="primary" block size="large" variant="flat" prepend-icon="mdi-lock" class="mb-4">
              Se connecter
            </v-btn>
            <v-btn @click="this.$router.push('/mot-de-passe-oublie')" color="secondary" block size="default" variant="flat"
                   prepend-icon="mdi-question-mark" class="mb-4">
              J'ai oublié mon mot de passe...
            </v-btn>
            <v-divider class="mb-4"></v-divider>
            <v-btn @click="connectWithGoogle()" block size="large" variant="outlined" color="orange"
                  prepend-icon="mdi-google">
              Se connecter avec Google
            </v-btn>

          </v-card-text>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { googleSdkLoaded } from "vue3-google-login";
import axios from "axios";

export default {
  name:    'Login',
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
    connectWithGoogle() {
      googleSdkLoaded(google => {
        google.accounts.oauth2
            .initCodeClient({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              scope: "email profile openid",
              redirect_uri: "/users/auth/google_oauth2/callback",
              callback: response => {
                console.log(response);
                if (response.code) {
                  this.sendCodeToBackend(response.code);
                }
              }
            }).requestCode();
      });
    },
    async sendCodeToBackend(code) {
      try {
        const response = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
              code,
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
              redirect_uri: "postmessage",
              grant_type: "authorization_code"
            }
        );
        const accessToken = response.data.access_token;
        // Fetch user details using the access token
        const userResponse = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
        );

        if (userResponse && userResponse.data) {
          this.userDetails = userResponse.data;

          this.$store.dispatch('sessionStore/connect_google', this.userDetails).then(response => {
            this.$root.showSnackbar("Vous êtes connecté", 'success');
            this.$router.push(response.data.redirect);
          }).catch((error) => {
            this.$root.showSnackbar("Identifiant incorrect", 'error');
          });

        } else {
          // Handle the case where userResponse or userResponse.data is undefined
          console.error("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Token exchange failed:", error.response.data);
      }
    }
  },
}
</script>

<style scoped>

</style>