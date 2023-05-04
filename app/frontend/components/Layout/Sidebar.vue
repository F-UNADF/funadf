<template>
  <v-navigation-drawer
      left
      elevation="10"
      mobile-breakpoint="960"
      app
      class="leftSidebar"
      :rail="rail"
      rail-width="75"
  >
    <!-- ---------------------------------------------- -->
    <!---Logo part -->
    <!-- ---------------------------------------------- -->
    <div class="pa-4">
      <div class="logo">
        <RouterLink to="/" justify-content-center>
          <img src="../../images/logo.png" alt="Logo ADD" style="max-width: 100%; margin: 0 auto;" />
        </RouterLink>
      </div>
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4" color="transparent">
        <!-- ---------------------------------------------- -->
        <!---Menu Loop -->
        <!-- ---------------------------------------------- -->
        <template v-for="(item, i) in sidebarMenu">
          <!-- ---------------------------------------------- -->
          <!---Item Sub Header -->
          <!-- ---------------------------------------------- -->
          <v-list-subheader v-if="!this.rail && item.header" style="border-bottom: solid 1px #e5e5e5">
            {{ item.header }}
          </v-list-subheader>
          <!-- ---------------------------------------------- -->
          <!---If Has Child -->
          <!-- ---------------------------------------------- -->
          <v-list-group v-else-if="item.children" class="">
            <!-- ---------------------------------------------- -->
            <!---Dropdown  -->
            <!-- ---------------------------------------------- -->
            <template v-slot:activator="{ props }">
              <v-list-item
                  v-bind="props"
                  :value="item.title"
                  rounded="lg"
                  class="mb-1"
              >
                <!---Icon  -->
                <template v-slot:prepend>
                  <v-icon>
                    {{ item.icon }}
                  </v-icon>
                </template>
                <!---Title  -->
                <v-list-item-title
                    v-text="item.title"
                ></v-list-item-title>
              </v-list-item>
            </template>
            <!-- ---------------------------------------------- -->
            <!---Sub Item-->
            <!-- ---------------------------------------------- -->
            <v-list-item
                v-for="(subitem, i) in item.children"
                :key="i"
                :value="subitem.to"
                :to="subitem.to"
                rounded="lg"
                class="first-level-item mb-1"
            >
              <template v-slot:prepend>
                <v-icon>disc</v-icon>
              </template>
              <v-list-item-title v-text="subitem.title"></v-list-item-title>
            </v-list-item>
          </v-list-group>
          <!-- ---------------------------------------------- -->
          <!---Single Item-->
          <!-- ---------------------------------------------- -->
          <v-list-item v-else :key="i" :to="item.to" rounded="lg" class="mb-1">
            <template v-slot:prepend>
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </template>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
          <!-- ---------------------------------------------- -->
          <!---End Single Item-->
          <!-- ---------------------------------------------- -->
        </template>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    rail: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      sidebarMenu: [
        {
          header: "ADMIN",
        },
        {
          title: "Accueil",
          icon: "mdi-home",
          to: "/",
        },
        {
          title: "Utilisateurs",
          icon: "mdi-account-group",
          to: "/users",
        },
        {
          title: "Eglises",
          icon: "mdi-church",
          to: "/churches",
        },
        {
          title: "Associations",
          icon: "mdi-office-building",
          to: "/associations",
        },
        {
          title: "Campagnes",
          icon: "mdi-vote",
          to: "/campaigns",
        },
      ],
    };
  },
}
</script>

<style scoped>

</style>