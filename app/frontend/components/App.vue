<template>
  <v-app theme="light" class="">
    <Sidebar :menu="this.getMenu" :showSidebar="showSidebar"></Sidebar>
    <Header :user="this.currentUser" :ouser="this.ouser" @logout="logout()"
      @toggle-sidebar="this.showSidebar = !this.showSidebar"></Header>
    <v-main class="main" scrollable>
      <v-container fluid class="page-wrapper">
        <router-view />
      </v-container>
      <v-footer class="bg-grey" absolute style="position: fixed; width: 100%; bottom: 0px;">
        <v-row justify="center">
          <v-col>
            &copy; {{ new Date().getFullYear() }} - <strong>Assemblées de Dieu de France</strong> - Tous droits
            réservés - <v-btn size="small" color="secondary" variant="text" class="link"
              @click="$router.push('privacy')">Mentions
              légales</v-btn>
          </v-col>
        </v-row>
      </v-footer>
    </v-main>



    <v-dialog v-model="dialogForm" fullscreen>
      <user-form></user-form>
    </v-dialog>

    <v-snackbar v-model="this.snackbar.show" :timeout="this.snackbar.timeout" :color="this.snackbar.color">
      <div v-html="snackbar.message"></div>
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="this.snackbar.show = false">
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
import UserForm from "@/components/Users/Form.vue";

export default ({
  name: 'App',
  components: {
    Sidebar,
    Header,
    UserForm,
  },
  computed: {
    ...mapGetters('sessionStore', {
      currentUser: 'currentUser',
      ouser: 'getOriginalUser',
    }),
    ...mapGetters('menuStore', [
      'getMenu',
    ]),
    dialogForm: {
      get() {
        return this.$store.state.usersStore.dialogForm;
      },
      set(value) {
        this.$store.commit('usersStore/setDialogForm', value);
      },
    },
  },

  methods: {
    ...mapActions('sessionStore', [
      'logout',
    ]),
    goTo: function (routeName) {
      this.$router.push({ name: routeName });
    },
    showSnackbar: function (message, color) {
      this.snackbar.show = true;
      this.snackbar.message = message;
      this.snackbar.color = color;
    },
  },
  data: () => ({
    snackbar: {
      show: false,
      message: '',
      color: '',
      timeout: 3000,
    },
    showSidebar: true,
  }),
  watch: {
    'currentUser': function (val) {
      let uris = window.location.hostname.split('.');
      let subdomain = 'votes';
      if (uris.length > 2) {
        subdomain = uris[0];
      }
      this.$store.dispatch('menuStore/getMenu', subdomain);
    },
  },
  beforeMount: function () {
    this.$store.dispatch('sessionStore/fetchUser');

    let uris = window.location.hostname.split('.');
    let subdomain = 'votes';
    if (uris.length > 2) {
      subdomain = uris[0];
    }
    this.$store.commit('sessionStore/setSubdomain', subdomain);
    this.$store.dispatch('menuStore/getMenu', subdomain);
  },
});
</script>

<style scoped>
.main {
  padding-bottom: 55px;
}
</style>