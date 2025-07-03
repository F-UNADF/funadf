<template>
  <v-container>
    <v-btn variant="text" color="primary" class="small mb-3" @click="$router.push({ name: 'feed.index' })">
      <v-icon left>mdi-arrow-left</v-icon>
      Retour au feed
    </v-btn>
    <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
    <PostItem v-else :post="post" />
  </v-container>
</template>

<script>
import axios from 'axios';
import PostItem from "@/components/Posts/me/Item.vue";

export default {
  name: 'PostsShow',
  components: {
      PostItem,
  },
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      post: null,
      loading: true,
    };
  },
  async mounted() {
    try {
      const response = await axios.get(`/api/posts/${this.$route.params.id}`);
      this.post = response.data.post;
      this.loading = false;
    } catch (error) {
      console.error("Erreur lors du chargement du post :", error);
    }
  },
};
</script>
