<template>
  <v-app theme="light">
    <Sidebar :menu="getMenu" :showSidebar="showSidebar" />
    <Header
        :user="currentUser"
        :ouser="ouser"
        @logout="logout"
        @toggle-sidebar="showSidebar = !showSidebar"
    />

    <v-main class="main">
      <v-container fluid class="page-wrapper">
        <router-view />
      </v-container>

      <!-- Footer -->
      <v-footer class="bg-grey position-fixed" style="width: 100%; bottom: 0;">
        <v-row justify="center">
          <v-col>
            &copy; {{ new Date().getFullYear() }} -
            <strong>Assemblées de Dieu de France</strong> - Tous droits réservés -
            <v-btn size="small" color="secondary" variant="text" class="link"
                   @click="$router.push('privacy')">Mentions légales</v-btn>
          </v-col>
        </v-row>
      </v-footer>
    </v-main>

    <!-- Dialog User Form -->
    <v-dialog v-model="dialogForm" fullscreen>
      <UserForm />
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color">
      <div v-html="snackbar.message"></div>
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Sidebar from "../components/Layout/Sidebar.vue";
import Header from "../components/Layout/Header.vue";
import UserForm from "../components/Users/Form.vue";

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

function getSubdomain() {
  const uris = window.location.hostname.split(".");
  return uris.length > 2 ? uris[0] : "me";
}

export default {
  name: "App",
  components: {
    Sidebar,
    Header,
    UserForm,
  },
  computed: {
    ...mapGetters("sessionStore", {
      currentUser: "currentUser",
      ouser: "getOriginalUser",
    }),
    ...mapGetters("menuStore", ["getMenu"]),
    dialogForm: {
      get() {
        return this.$store.state.usersStore.dialogForm;
      },
      set(value) {
        this.$store.commit("usersStore/setDialogForm", value);
      },
    },
  },
  methods: {
    ...mapActions("sessionStore", ["logout"]),
    showSnackbar(message, color) {
      this.snackbar.show = true;
      this.snackbar.message = message;
      this.snackbar.color = color;
    },
  },
  data() {
    return {
      snackbar: {
        show: false,
        message: "",
        color: "",
        timeout: 3000,
      },
      showSidebar: true,
    };
  },
  watch: {
    currentUser() {
      let subdomain = getSubdomain();
      this.$store.dispatch("menuStore/getMenu", subdomain);
    },
  },
  beforeMount() {
    this.$store.dispatch("sessionStore/fetchUser");

    let subdomain = getSubdomain();

    this.$store.commit("sessionStore/setSubdomain", subdomain);
    this.$store.dispatch("menuStore/getMenu", subdomain);
  },
  mounted() {

    const firebaseConfig = {
      apiKey: "AIzaSyCxbYAg-_eIci32Qf1ZRoKZLwkOD-vTuHo",
      authDomain: "funadf-49dfb.firebaseapp.com",
      projectId: "funadf-49dfb",
      storageBucket: "funadf-49dfb.firebasestorage.app",
      messagingSenderId: "609947767440",
      appId: "1:609947767440:web:17de62d5e49d3a0c2ffe15",
      measurementId: "G-394J13VTZX"
    };
    const app = initializeApp(firebaseConfig);

    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // ...
    });
    getToken(messaging, { vapidKey: 'BEyOqkLkTZNA4TwFhvV-qZATkpgAfPX1adfgtoFgji1UwhCfaKb8nP7473f4NzXmMj6dnGEnwt5FuAf-7TwUbxg' }).then((currentToken) => {
      if (currentToken) {
        console.log('currentToken:', currentToken);
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });

  }
};
</script>

<style scoped>
.main {
  padding-bottom: 55px;
}
</style>
