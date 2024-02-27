<template>
  <v-app-bar color="white" elevation="2">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="this.$emit('toggleSidebar')"></v-app-bar-nav-icon>
    </template>
    <template v-slot:append>
      <v-btn @click="switch_back()" color="green" variant="flat" v-if="ouser !== null">
        <v-icon>mdi-account-switch</v-icon>
        Revenir à {{ this.ouser?.firstname }}
      </v-btn>
      <v-menu anchor="bottom end" min-width="300" origin="auto" v-if="user !== null">
        <template v-slot:activator="{ props }">
          <v-btn :ripple="false" class="pa-0 px-1" color="transparent" elevation="0" plain v-bind="props">
            <v-img :src="getAvatar(user)" class="rounded-circle img-fluid" width="45px"></v-img>
          </v-btn>
        </template>

        <v-list class="pa-6" elevation="10" rounded="lg">
          <h4 class="font-weight-medium fs-18">Profil</h4>
          <div class="d-flex align-center my-4">
            <img :alt="this.user.fullname" :src="'/avatars/' + this.user.id + '.png'" class="rounded-circle" width="90" />
            <div class="ml-4">
              <h4 class="font-weight-medium fs-18">{{ this.user.firstname }} {{ this.user.lastname }}</h4>
              <span class="subtitle-2 text-grey font-weight-light">
                <v-icon>mdi-id-card</v-icon>
                {{ this.user.id }}
              </span>
              <div class="d-flex align-center">
                <span class="subtitle-2 font-weight-light ml-1">{{ this.user.email }}</span>
              </div>
            </div>
          </div>

          <v-btn block class="mt-4 py-4" color="primary" @click="editProfile()" variant="flat"
            prepend-icon="mdi-account-edit">
            Modifier mon profil
          </v-btn>

          <v-btn block class="mt-4 py-4" color="secondary" @click="$emit('logout')" variant="flat"
            prepend-icon="mdi-logout">
            Se déconnecter
          </v-btn>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script>

export default {
  name: "Header",
  props: {
    user: {
      type: Object,
      required: true,
    },
    ouser: {
      type: Object,
      required: false,
    },
  },
  methods: {
    getAvatar: function (user) {
      return "/avatars/" + user.id + ".png";
    },
    switch_back: function () {
      this.$store.dispatch('sessionStore/switch_back');
    },
    editProfile: function () {
      this.$store.dispatch('usersStore/getItem', this.user.id);
    },
  },
};

</script>
