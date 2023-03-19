<template>
  <v-app>
    <Sidebar></Sidebar>

    <v-main scrollable>
      <v-container class="py-8 px-6" fluid>
        <router-view/>
      </v-container>
    </v-main>

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
    ...mapGetters([
        'currentUser',
    ]),
  },

  methods: {
    goTo: function (routeName) {
      this.$router.push({name: routeName});
    }
  },
  beforeMount: function () {
    this.$store.dispatch('fetchUser');
  },
});
</script>