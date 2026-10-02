<template>
  <v-app-bar color="white" :elevation="1">
    <template v-slot:prepend>
      <v-app-bar-nav-icon aria-label="Afficher ou masquer le menu" @click="this.$emit('toggleSidebar')"></v-app-bar-nav-icon>
    </template>

    <h1 v-if="title" class="page-title text-truncate flex-grow-1 ms-1">{{ title }}</h1>

    <template v-slot:append>
      <NotificationBell />

      <v-btn @click="switch_back()" color="success" variant="flat" v-show="ouser" class="mx-2"
        prepend-icon="mdi-account-switch">
        Revenir à {{ this.ouser?.firstname }}
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon variant="text" class="mr-2" aria-label="Mon compte">
            <v-avatar size="40" color="primary">
              <v-img v-if="user?.id" :src="'/avatars/' + user.id + '.png'" :alt="user?.fullname || 'Mon compte'" cover></v-img>
              <v-icon v-else>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-card class="pa-5" min-width="300" rounded="lg">
          <div class="d-flex align-center mb-4">
            <v-avatar size="64" color="primary">
              <v-img v-if="user?.id" :src="'/avatars/' + user.id + '.png'" :alt="user?.fullname" cover></v-img>
            </v-avatar>
            <div class="ml-4" style="min-width: 0">
              <div class="text-subtitle-1 font-weight-bold">{{ this.user?.firstname }} {{ this.user?.lastname }}</div>
              <div class="text-body-2 text-medium-emphasis text-truncate">{{ this.user?.email }}</div>
              <div class="text-caption text-medium-emphasis">
                <v-icon size="small">mdi-card-account-details-outline</v-icon>
                N° {{ zeroPad(this.user?.id || 0) }}
              </div>
            </div>
          </div>

          <v-btn block color="primary" @click="editProfile()" variant="flat" prepend-icon="mdi-account-edit">
            Modifier mon profil
          </v-btn>
          <v-btn block class="mt-2" variant="text" prepend-icon="mdi-logout" @click="logout()">
            Se déconnecter
          </v-btn>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script>
import NotificationBell from '../Notifications/NotificationBell.vue';

export default {
  name: "Header",
  components: {
    NotificationBell,
  },
  props: {
    user: {
      type: [Object, null],
      default: null,
      required: true,
    },
    ouser: {
      type: [Object, null],
      default: null,
      required: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  computed: {
    zeroPad: function () {
      return function (num) {
        var zero = 5 - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
      };
    },
  },
  methods: {
    switch_back: function () {
      this.$store.dispatch('sessionStore/switch_back');
    },
    logout: function () {
      this.$store.dispatch('sessionStore/logout');
    },
    editProfile: function () {
      this.$store.dispatch('usersStore/getItem', this.user.id);
    },
  },
  data() {
    return {
      menu: false,
    };
  },
};

</script>
