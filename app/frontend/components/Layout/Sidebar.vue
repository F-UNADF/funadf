<template>
  <v-navigation-drawer left elevation="10" mobile-breakpoint="960" app class="leftSidebar" :rail="false"
    v-model="sidebarValue" rail-width="75">
      <div class="pa-4">
        <div class="logo">
          <RouterLink to="/" justify-content-center>
            <img src="../../images/logo.png" alt="Logo ADD" style="max-width: 100%; margin: 0 auto;" />
          </RouterLink>
        </div>
      </div>
      <perfect-scrollbar class="scrollnavbar">
        <v-list class="pa-4" color="transparent">
          <template v-for="(item, i) in menu" :key="i">
            <v-list-subheader v-if="item.header" style="border-bottom: solid 1px #e5e5e5" :key="'header-' + i">
              {{ item.header }}
            </v-list-subheader>

            <v-list-group v-else-if="item.children" :value="item.title">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" :value="item.title" rounded="lg" class="mb-1">
                  <template v-slot:prepend>
                    <v-icon>
                      {{ item.icon }}
                    </v-icon>
                  </template>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item>
              </template>

              <v-list-item v-for="(subitem, j) in item.children" :value="subitem.to" :key="'main'+i+'-sub-' + j" :to="subitem.to" rounded="lg"
                class="first-level-item mb-1">
                <template v-slot:prepend>
                  <v-icon>disc</v-icon>
                </template>
                <v-list-item-title v-text="subitem.title"></v-list-item-title>
              </v-list-item>
            </v-list-group>
            <!-- ---------------------------------------------- -->
            <!---Single Item-->
            <!-- ---------------------------------------------- -->
            <v-list-item v-else-if="!!item.to" :to="item.to" rounded="lg" class="mb-1">
              <template v-slot:prepend>
                <v-badge dot color="red" v-if="item.new_tab">
                  <v-icon>
                    {{ item.icon }}
                  </v-icon>
                </v-badge>
                <v-icon v-else>
                  {{ item.icon }}
                </v-icon>
              </template>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item>

            <v-list-item v-else :href="item.href" rounded="lg" class="mb-1">
              <template v-slot:prepend>
                <v-badge dot color="red" v-if="item.new_tab">
                  <v-icon>
                    {{ item.icon }}
                  </v-icon>
                </v-badge>
                <v-icon v-else>
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
import {PerfectScrollbar} from "vue3-perfect-scrollbar";

export default {
  name: "Sidebar",
  components: {PerfectScrollbar},
  computed: {
    sidebarValue: {
      get() {
        return this.showSidebar;
      },
      set(value) {
        this.$emit("update:showSidebar", value);
      },
    },
  },
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
    showSidebar: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    isCurrentUrl: function (url) {
      if (this.isURL(url)) return window.location.href === url;
      else return this.$route.path === url;
    },
    isURL: function (string) {
      // Regular expression pattern for URL validation
      let urlPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
      return urlPattern.test(string);
    }
  },
}
</script>

<style scoped>
.v-list-item {
  display: flex;
}

.scrollnavbar .v-list--one-line .v-list-group__items .v-list-item .v-list-item__prepend>.v-icon,
.scrollnavbar .v-list--one-line .v-list-item .v-list-item__prepend>.v-icon {
  margin-inline-end: 0;
}
</style>