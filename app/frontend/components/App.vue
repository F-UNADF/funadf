<template>
  <v-app theme="light">
    <!-- Pages d'authentification : pas de coquille (menu, en-tête), juste la marque -->
    <v-main v-if="isAuthPage" class="auth-main">
      <div class="auth-wrapper">
        <img src="../images/logo_plus.png" alt="ADD+" class="auth-logo" />
        <router-view />
      </div>
      <footer class="app-footer app-footer--auth">
        &copy; {{ new Date().getFullYear() }} Assemblées de Dieu de France
        <router-link to="/privacy" class="app-footer__link">Mentions légales</router-link>
      </footer>
    </v-main>

    <template v-else>
      <Sidebar :menu="getMenu" v-model:showSidebar="showSidebar" :is-mobile="isMobile" />
      <Header :user="currentUser" :ouser="ouser" :title="pageTitle" @toggle-sidebar="toggleSidebar" />

      <v-main class="main">
        <v-container fluid class="page-wrapper">
          <router-view />
        </v-container>

        <footer class="app-footer">
          &copy; {{ new Date().getFullYear() }} Assemblées de Dieu de France – Tous droits réservés
          <router-link to="/privacy" class="app-footer__link">Mentions légales</router-link>
        </footer>

        <v-tooltip v-if="showBell" text="Activer les notifications sur ce navigateur" location="start">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="notification-button" size="large" icon="mdi-bell-ring-outline"
              color="secondary" aria-label="Activer les notifications sur ce navigateur"
              @click="askNotification()"></v-btn>
          </template>
        </v-tooltip>
      </v-main>
    </template>

    <!-- Dialog User Form -->
    <v-dialog v-model="dialogForm" fullscreen>
      <UserForm />
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color">
      <v-row align="center" justify="start" no-gutters class="snackbar-content flex-nowrap">
        <v-img v-if="snackbar.photo" cover :src="snackbar.photo" :width="80" aspect-ratio="1/1" class="mr-5"></v-img>
        <div>
          <div class="text-subtitle-1 pb-2" v-if="snackbar.title">{{ snackbar.title }}</div>
          <div v-html="snackbar.message"></div>
        </div>
      </v-row>
      <template v-slot:actions>
        <v-btn color="white" variant="text" icon="mdi-close" aria-label="Fermer le message"
          @click="snackbar.show = false"></v-btn>
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
    isAuthPage() {
      return this.$route.meta?.auth === true;
    },
    pageTitle() {
      return this.$route.meta?.title || "";
    },
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
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },

    handleBreakpointChange(e) {
      this.isMobile = e.matches;

      if (this.isMobile) {
        this.showSidebar = false;
      } else {
        this.showSidebar = true;
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
      showSidebar: false,
      showSidebarOverlay: false,
      isMobile: false,
      mediaQuery: null,
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
  mounted() {
    this.initMessaging();

    this.mediaQuery = window.matchMedia("(max-width: 767px)");
    this.isMobile = this.mediaQuery.matches;
    this.showSidebar = !this.isMobile;

    this.mediaQuery.addEventListener("change", this.handleBreakpointChange);

    isSupported().then((supported) => {
      if (!supported) {
        this.showBell = false;
        return;
      }

      const permission = Notification.permission;
      this.showBell = permission === "default";
    });
  },
  beforeUnmount() {
    this.mediaQuery?.removeEventListener("change", this.handleBreakpointChange);
  },
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
}

.page-wrapper {
  flex: 1 0 auto;
}

/* Pied de page dans le flux : il ne masque plus le bas des tableaux et formulaires */
.app-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 16px;
  padding: 12px 32px;
  font-size: 0.8125rem;
  color: rgba(var(--v-theme-on-background), 0.7);
  border-top: 1px solid rgb(var(--v-theme-border));
}

.app-footer__link {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
  text-underline-offset: 2px;
}

.app-footer--auth {
  justify-content: center;
  border-top: 0;
}

.v-main.auth-main {
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-grayLighter));
}

.auth-wrapper {
  flex: 1 0 auto;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: 48px 16px 24px;
}

.auth-logo {
  display: block;
  width: 140px;
  margin: 0 auto 32px;
}

.notification-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  /* Attire l'oeil trois fois puis se calme */
  animation: nudge 0.6s ease-in-out 1s 3;
}

@keyframes nudge {
  0%, 100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-12deg);
  }
  75% {
    transform: rotate(12deg);
  }
}
</style>
