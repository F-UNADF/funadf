<template>
  <section aria-labelledby="feed-posts-title">
    <h2 id="feed-posts-title" class="feed-section-title">
      <v-icon size="small" class="me-2">mdi-newspaper-variant-outline</v-icon>
      Actualités
    </h2>
    <v-text-field v-model="search" label="Rechercher une actualité" prepend-inner-icon="mdi-magnify" variant="outlined"
      density="comfortable" hide-details clearable class="mb-4" @update:model-value="searching()"></v-text-field>

    <template v-if="showSkeleton">
      <v-skeleton-loader v-for="n in 2" :key="n" type="article" class="mb-4"></v-skeleton-loader>
    </template>

    <v-alert v-else-if="error && items.length === 0" type="error" variant="tonal" class="mb-4">
      Les actualités n’ont pas pu être chargées.
      <template v-slot:append>
        <v-btn variant="text" @click="reload()">Réessayer</v-btn>
      </template>
    </v-alert>

    <div v-else-if="items.length === 0" class="feed-empty">
      <v-icon size="40" color="grayLight">mdi-newspaper-variant-outline</v-icon>
      <p class="text-subtitle-1 font-weight-medium mt-2 mb-1">
        {{ search ? `Aucune actualité ne correspond à « ${search} »` : 'Aucune actualité pour le moment' }}
      </p>
      <p class="text-body-2 text-medium-emphasis">
        {{ search ? 'Essayez un autre mot.' : 'Les actualités de vos églises et associations apparaîtront ici.' }}
      </p>
    </div>

    <template v-else>
      <PostItem v-for="post in items" :key="post.id" :post="post" class="mb-4"
        @click="this.$router.push({ name: 'post.show', params: { id: post.id } })" />
    </template>

    <v-btn v-if="hasMore && !search" block variant="tonal" color="primary" @click="load()" :loading="loading">
      Voir plus d’actualités
    </v-btn>
  </section>
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
      loaded: 'getLoaded',
      hasMore: 'getHasMore',
      error: 'getError',
    }),
    showSkeleton() {
      return this.search_in_progress || (this.loading && this.items.length === 0);
    },
  },
  methods: {
    load: function () {
      this.$store.dispatch('feedStore/loadMore');
    },
    reload: function () {
      this.$store.dispatch('feedStore/items').catch(() => {});
    },
    searching: function () {
      clearTimeout(this.timer);
      this.search_in_progress = true;
      const query = (this.search || '').trim();

      this.timer = setTimeout(() => {
        const request = query.length === 0
          ? this.$store.dispatch('feedStore/items')
          : this.$store.dispatch('feedStore/search', query);
        request.catch(() => {}).finally(() => {
          this.search_in_progress = false;
        });
      }, 400);
    },
  },
  data: () => ({
    search: '',
    search_in_progress: false,
    timer: null,
  }),
  beforeMount: function () {
    this.$store.dispatch('feedStore/items').catch(() => {});
  },
}
</script>

<style scoped>
.feed-empty {
  text-align: center;
  padding: 40px 16px;
  border: 1px dashed rgb(var(--v-theme-border));
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>