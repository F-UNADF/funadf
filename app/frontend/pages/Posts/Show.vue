<template>
  <div class="reading-width">
    <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" class="mb-3 px-2"
      @click="$router.push({ name: 'feed.index' })">
      Retour au fil d’actualité
    </v-btn>
    <v-alert v-if="error" type="warning" variant="tonal">
      Cette actualité n’a pas pu être affichée. Elle a peut-être été supprimée ou vous n’y avez pas accès.
    </v-alert>
    <v-skeleton-loader v-else-if="loading" type="card"></v-skeleton-loader>
    <PostItem v-else :post="post" />
  </div>
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
      error: false,
    };
  },
  async mounted() {
    try {
      const response = await axios.get(`/api/posts/${this.$route.params.id}`);
      this.post = response.data.post;
      this.loading = false;
    } catch (error) {
      this.error = true;
    }
  },
};
</script>
