<template>
  <v-app-bar
      color="transparent"
      elevation="0">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="this.$emit('toggle-sidebar')"></v-app-bar-nav-icon>
    </template>
    <template v-slot:append>
      <v-menu v-if="!!user" anchor="bottom end" min-width="300" origin="auto">
        <template v-slot:activator="{ props }">
          <v-btn
              :ripple="false"
              class="pa-0 px-1"
              color="transparent"
              elevation="0"
              plain
              v-bind="props"
          >
            <v-img
                :src="'/avatars/' + user.id + '.png'"
                class="rounded-circle img-fluid"
                width="45px"
            ></v-img>
          </v-btn>
        </template>

        <v-list class="pa-6" elevation="10" rounded="lg">
          <h4 class="font-weight-medium fs-18">Profil</h4>
          <div class="d-flex align-center my-4">
            <img
                :alt="user.fullname"
                :src="'/avatars/' + user.id + '.png'"
                class="rounded-circle"
                width="90"
            />
            <div class="ml-4">
              <h4 class="font-weight-medium fs-18">{{ user.fullname }}</h4>
              <span class="subtitle-2 font-weight-light">{{ user.level }}</span>
              <div class="d-flex align-center">
                <span class="subtitle-2 font-weight-light ml-1">{{ user.email }}</span>
              </div>
            </div>
          </div>

          <v-btn
              block
              class="mt-4 py-4"
              color="secondary"
              @click="$emit('logout')"
              variant="flat"
          >Se déconnecter
          </v-btn
          >
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
  },
};

</script>
