<template>
  <v-app theme="light"
         class="">

    <Sidebar :menu="this.getMenu"  :showSidebar="showSidebar"></Sidebar>
    <Header :user="currentUser" @logout="logout()" @toggle-sidebar="this.showSidebar = !this.showSidebar"></Header>
    <v-main scrollable>
      <v-container fluid class="page-wrapper">
        <router-view/>
      </v-container>
    </v-main>

    <v-snackbar v-model="this.snackbar.show" :timeout="this.snackbar.timeout" :color="this.snackbar.color">
      <div v-html="snackbar.message"></div>
      <template v-slot:actions>
        <v-btn
            color="white"
            variant="text"
            @click="this.snackbar.show = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import Sidebar from "../components/Layout/Sidebar.vue";
import Header from "../components/Layout/Header.vue";

export default ({
  name      : 'App',
  components: {
    Sidebar,
    Header,
  },
  computed  : {
    ...mapGetters('sessionStore', [
      'currentUser',
    ]),
    ...mapGetters('menuStore', [
      'getMenu',
    ]),
  },

  methods    : {
    ...mapActions('sessionStore', [
      'logout',
    ]),
    goTo: function (routeName) {
      this.$router.push({name: routeName});
    },
    showSnackbar: function (message, color) {
      this.snackbar.show = true;
      this.snackbar.message = message;
      this.snackbar.color = color;
    },
  },
  data       : () => ({
    snackbar: {
      show   : false,
      message: '',
      color  : '',
      timeout: 3000,
    },
    showSidebar: false,
  }),
  beforeMount: function () {
    this.$store.dispatch('sessionStore/fetchUser');
    this.$store.dispatch('menuStore/getMenu');
  },
});
</script>