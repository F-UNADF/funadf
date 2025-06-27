<template>
  <v-app-bar color="white" :elevation="2">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="this.$emit('toggleSidebar')"></v-app-bar-nav-icon>
    </template>

    <template v-slot:append>
      <NotificationBell />

      <v-btn @click="switch_back()" color="green" variant="flat" v-show="ouser">
        <v-icon>mdi-account-switch</v-icon>
        Revenir à {{ this.ouser?.firstname }}
      </v-btn> 

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="pa-0 px-1" color="transparent" elevation="0" plain>
            <img :src="getAvatar(user)" class="rounded-circle img-fluid" width="45px" alt="Avatar User"/>
          </v-btn>
        </template>

        <v-list class="pa-6" elevation="10" rounded="lg">
          <div>
            <h4 class="font-weight-medium fs-18">Profil</h4>
            <div class="d-flex align-center my-4">
              <img :alt="this.user?.fullname" :src="'/avatars/' + this.user?.id + '.png'" class="rounded-circle"
                   width="90"/>
              <div class="ml-4">
                <h4 class="font-weight-medium fs-18">{{ this.user?.firstname }} {{ this.user?.lastname }}</h4>
                <span class="subtitle-2 text-grey font-weight-light">
                    <v-icon>mdi-id-card</v-icon>
                    {{ zeroPad(this.user?.id || 0) }}
                  </span>
                <div class="d-flex align-center">
                  <span class="subtitle-2 font-weight-light ml-1">{{ this.user?.email }}</span>
                </div>
              </div>
            </div>

            <v-btn block class="mt-4 py-4" color="primary" @click="editProfile()" variant="flat"
                   prepend-icon="mdi-account-edit">
              Modifier mon profil
            </v-btn>
          </div>
        </v-list>
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
    getAvatar: function (user) {
      if (!user || !user.hasOwnProperty('id')) {
        return "https://fakeimg.pl/200x200/015486/F8F9FA/?retina=1&text=?";
      }
      return "/avatars/" + user.id + ".png";
    },
    switch_back: function () {
      this.$store.dispatch('sessionStore/switch_back');
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
