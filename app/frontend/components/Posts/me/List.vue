<template>
  <v-row class="mt-4">
    <v-col cols="12">
      <h3 class="text-h6 text-grey">
        <v-icon>mdi-rss</v-icon>
        Actualités
      </h3>
    </v-col>
    <v-col cols="12">
      <v-text-field
          v-model="search"
          label="Chercher une actualité"
          append-icon="mdi-magnify"
          single-line
          hide-details
          @change="searching()"
      ></v-text-field>
    </v-col>
    <v-col cols="12" v-for="post in items" :key="post.id">
      <PostItem :post="post"/>
    </v-col>
    <v-col cols="12">
      <v-btn append-icon="mdi-plus-circle" block size="large" color="primary" @click="load()"
             :loading="this.loading">
        VOIR PLUS
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import PostItem from "@/components/Posts/me/Item.vue";
import {mapGetters} from "vuex";

export default {
  components : {PostItem,},
  computed   : {
    ...mapGetters('feedStore', {
      items  : 'getItems',
      loading: 'getLoading',
    }),
  },
  methods    : {
    load     : function () {
      this.$store.dispatch('feedStore/loadMore');
    },
    searching: function () {
      if (this.search.length === 0) {
        this.$store.dispatch('feedStore/items');
        return;
      }
      this.$store.dispatch('feedStore/search', this.search);
    },
  },
  data       : () => ({
    search: '',
  }),
  beforeMount: function () {
    this.$store.dispatch('feedStore/items');
  },
}
</script>

<style scoped>

</style>