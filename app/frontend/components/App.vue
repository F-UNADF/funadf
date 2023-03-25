<template>
  <v-app>
    <Sidebar></Sidebar>

    <v-main scrollable>
      <v-container class="py-8 px-6" fluid>
        <router-view/>
      </v-container>
    </v-main>


    <v-snackbar v-model="this.snackbar.show" :timeout="this.snackbar.timeout" :color="this.snackbar.color">
      {{ snackbar.message }}
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

export default ({
  name: 'App',
  components: {
    Sidebar,
  },
  computed: {
    ...mapGetters('sessionStore', [
      'currentUser',
    ]),
  },

  methods: {
    goTo: function (routeName) {
      this.$router.push({name: routeName});
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
  }),
  beforeMount: function () {
    this.$store.dispatch('sessionStore/fetchUser');
  },
});
</script>