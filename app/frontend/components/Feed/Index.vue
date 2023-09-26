<template>
  <v-row class="mt-4">
    <v-col cols="12" v-for="post in items" :key="post.id">
      <PostItem :post="post" />
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from "vuex";
import PostItem from "../Posts/me/Item.vue";

export default {
  name: "FeedIndex",
  components: {
    PostItem,
  },
  computed  : {
    ...mapGetters('feedStore', {
      items       : 'getItems',
      loading     : 'getLoading',
    }),
  },
  beforeMount: function () {
    this.$store.dispatch('feedStore/items');
  },
}

</script>

<style scoped>


</style>