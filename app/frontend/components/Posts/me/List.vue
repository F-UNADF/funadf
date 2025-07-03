<template>
  <v-row class="mt-4">
    <v-col cols="12">
      <h3 class="text-h6 text-grey">
        <v-icon>mdi-rss</v-icon>
        Actualités
      </h3>
    </v-col>
    <v-col cols="12">
      <v-text-field v-model="search" label="Chercher une actualité" append-icon="mdi-magnify" single-line hide-details
        @keyup="searching($event)"></v-text-field>
    </v-col>
    <v-col cols="12" v-for="post in items" :key="post.id" v-if="!this.search_in_progress">
      <PostItem :post="post" @click="this.$router.push({ name: 'post.show', params: { id: post.id } })" />
    </v-col>
    <v-col cols="12" v-if="this.search_in_progress">
      <v-row>
        <v-col>
          <v-progress-circular style="display: block; margin: 0 auto;" color="primary" indeterminate :size="50"
            :width="8"></v-progress-circular>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-btn append-icon="mdi-plus-circle" block size="large" color="primary" @click="load()" :loading="this.loading">
        VOIR PLUS
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import PostItem from "@/components/Posts/me/Item.vue";
import { mapGetters } from "vuex";

export default {
  components: { PostItem, },
  computed: {
    ...mapGetters('feedStore', {
      items: 'getItems',
      loading: 'getLoading',
    }),
  },
  methods: {
    load: function () {
      this.$store.dispatch('feedStore/loadMore');
    },
    searching: function () {
      clearTimeout(this.timer);
      this.search_in_progress = true;

      this.timer = setTimeout(() => {
        if (this.search.length === 0) {
          this.$store.dispatch('feedStore/items');
          this.search_in_progress = false;
          return;
        }
        this.$store.dispatch('feedStore/search', this.search);
        this.search_in_progress = false;
      }, 1500);
    },
  },
  data: () => ({
    search: '',
    search_in_progress: false,
    offset: 0,
  }),
  beforeMount: function () {
    this.offset = 0;
    this.$store.dispatch('feedStore/items', this.offset);
  },
}
</script>

<style scoped></style>