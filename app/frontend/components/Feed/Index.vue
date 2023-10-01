<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <v-row class="mt-4">
          <v-infinite-scroll :items="items" :onLoad="load">
            <v-col cols="12" v-for="post in items" :key="post.id">
              <PostItem :post="post" />
            </v-col>
          </v-infinite-scroll>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";
import PostItem from "../Posts/me/Item.vue";
import { VInfiniteScroll } from 'vuetify/labs/VInfiniteScroll'

export default {
  name: "FeedIndex",
  components: {
    PostItem,
    VInfiniteScroll,
  },
  computed  : {
    ...mapGetters('feedStore', {
      items       : 'getItems',
      loading     : 'getLoading',
    }),
  },
  methods   : {
    async load ({ done }) {
      const res = await this.api();
      this.items.push(...res);
    },
  },
  beforeMount: function () {
    this.$store.dispatch('feedStore/items');
  },
}

</script>

<style scoped>


</style>