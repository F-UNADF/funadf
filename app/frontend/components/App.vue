<template>
  <v-app theme="light">
    <Sidebar :menu="getMenu" v-model:showSidebar="showSidebar" />
    <Header
        :user="currentUser"
        :ouser="ouser"
        @toggle-sidebar="showSidebar = !showSidebar"
    />

    <v-main class="main">
      <v-container fluid class="page-wrapper">
        <router-view/>
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
    </v-main>

    <!-- Dialog User Form -->
    <v-container>
      <v-dialog v-model="dialogForm" fullscreen>
        <UserForm/>
      </v-dialog>
    </v-container>

    <!-- Snackbar -->
    <v-container>
      <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color">
        <v-row align="center" justify="start" no-gutters class="snackbar-content">
          <v-img v-if="snackbar.photo" cover :src="snackbar.photo" :width="80" aspect-ratio="1/1"
                 class="mr-5"></v-img>
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
import {mapGetters, mapActions} from "vuex";
import Sidebar from "../components/Layout/Sidebar.vue";
import Header from "../components/Layout/Header.vue";
import UserForm from "../components/Users/Form.vue";

import {initializeApp} from 'firebase/app';
import {getMessaging, getToken, onMessage} from "firebase/messaging";

function getSubdomain() {
  const hostname = window.location.hostname;
  let menu = 'me';

  if (hostname.includes('admin')){
    menu = 'admin';
  } else if (hostname.includes('association')){
    menu = 'association';
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
  mounted() {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    };
    const app = initializeApp(firebaseConfig);
    this.messaging = getMessaging(app); // Stocke dans this.messaging
    onMessage(this.messaging, (payload) => {
      this.showSnackbar(payload.notification.body, "success", payload.notification.title, payload.notification.image);
    });
  }
};
</script>

<style scoped>
.main {
  padding-bottom: 55px;
}
</style>
