<template>
  <v-app theme="light">
    <Sidebar :menu="getMenu" v-model:showSidebar="showSidebar" />
    <Header :user="currentUser" :ouser="ouser" @toggle-sidebar="showSidebar = !showSidebar" />

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
            <v-btn size="small" color="secondary" variant="text" class="link" :to="{ path: '/privacy' }">
              Mentions légales
            </v-btn>
          </v-col>
        </v-row>
      </v-footer>

      <v-btn v-if="this.showBell" class="notification-button" size="x-large" icon color="info"
        @click="askNotification()">
        <v-icon class="white--text">mdi-bell</v-icon>
      </v-btn>
    </v-main>

    <!-- Dialog User Form -->
    <v-container>
      <v-dialog v-model="dialogForm" fullscreen>
        <UserForm />
      </v-dialog>
    </v-container>

    <!-- Snackbar -->
    <v-container>
      <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color">
        <v-row align="center" justify="start" no-gutters class="snackbar-content">
          <v-img v-if="snackbar.photo" cover :src="snackbar.photo" :width="80" aspect-ratio="1/1" class="mr-5"></v-img>
          <div>
            <div class="text-subtitle-1 pb-2" v-if="snackbar.title">{{ snackbar.title }}</div>
            <div v-html="snackbar.message"></div>
          </div>
        </v-row>
        <template v-slot:actions>
          <v-btn color="white" variant="text" @click="snackbar.show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Sidebar from "../components/Layout/Sidebar.vue";
import Header from "../components/Layout/Header.vue";
import UserForm from "../components/Users/Form.vue";

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

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
let messaging = null;

function getSubdomain() {
  // on recupere le path de l'url
  let path = window.location.pathname;

  let menu = 'me';
  // si le path commence par /admin
  if (path.startsWith('/admin')) {
    menu = 'admin';
  } else if (path.startsWith('/association')) {
    menu = 'association';
  } else if (path.startsWith('/region')) {
    menu = 'region';
  }

  return menu;
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
    showSnackbar(message, color, title = null, photo = null) {
      this.snackbar.title = title;
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.photo = photo;
      this.snackbar.show = true;
    },
    async initMessaging() {
      if (await isSupported()) {
        messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
          this.showSnackbar(payload.notification.body, "success", payload.notification.title, payload.notification.image);
        });
      } else {
        console.warn("Notifications not supported in this browser.");
      }
    },
    async askNotification() {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        this.showBell = false;
        this.showSnackbar("Permission refusée pour les notifications", "error");
        return;
      }

      try {
        const token = await getToken(messaging, {
          vapidKey: "BEyOqkLkTZNA4TwFhvV-qZATkpgAfPX1adfgtoFgji1UwhCfaKb8nP7473f4NzXmMj6dnGEnwt5FuAf-7TwUbxg"
        });

        if (token) {
          this.showBell = false;
          await this.$store.dispatch("sessionStore/storeDeviceToken", {
            token,
            user_id: this.currentUser.id,
            platform: "web",
          });
          this.showSnackbar("Notifications activées avec succès", "success");
        } else {
          this.showBell = false;
          this.showSnackbar("Aucun token généré", "error");
        }
      } catch (err) {
        this.showBell = false;
        console.error("Erreur lors de la récupération du token :", err);
        this.showSnackbar("Erreur lors de l'enregistrement du token", "error");
      }
    },
  },
  data() {
    return {
      snackbar: {
        show: false,
        title: null,
        message: "",
        color: "",
        photo: null,
        timeout: 10000,
      },
      showBell: true,
      showSidebar: true,
      messaging: null,
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
  async mounted() {
    this.initMessaging();

    const supported = await isSupported();

    if (!supported) {
      // Pas supporté, ne pas afficher la cloche
      this.showBell = false;
      return;
    }

    // On vérifie la permission actuelle
    const permission = Notification.permission; // "granted", "denied" ou "default"

    if (permission === "default") {
      // Afficher la cloche pour demander la permission
      this.showBell = true;
    } else {
      // "granted" ou "denied" => ne pas afficher
      this.showBell = false;
    }
  }
};
</script>

<style scoped>
.main {
  padding-bottom: 55px;
}

.notification-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;

  /* Petit shake animation toutes les 10 sec */
  animation: shake 10s infinite;
  animation-name: shake;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-delay: 0s;
  animation-fill-mode: forwards;
  animation-play-state: running;
  animation-fill-mode: forwards;
  animation-play-state: running;
  animation-delay: 0s;
}

@keyframes shake {
  0% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(-10px, 0px);
  }

  100% {
    transform: translate(0, 0);
  }
}
</style>
