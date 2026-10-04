<template>
  <section>
    <h2 id="feed-events-title" class="feed-section-title">
      <v-icon size="small" class="me-2">mdi-calendar-month-outline</v-icon>
      Prochains événements
    </h2>

    <template v-if="loading && items.length === 0">
      <v-skeleton-loader v-for="n in 2" :key="n" type="list-item-avatar-two-line" class="mb-3"></v-skeleton-loader>
    </template>

    <p v-else-if="error && items.length === 0" class="text-body-2 text-error">
      Les événements n’ont pas pu être chargés.
    </p>

    <p v-else-if="items.length === 0" class="text-body-2 text-medium-emphasis">
      Aucun événement à venir pour le moment.
    </p>

    <template v-else>
      <EventItem v-for="event in items" :key="event.id" :event="event" class="mb-3" />
    </template>

    <v-btn v-if="hasMore" block variant="text" color="primary" @click="load()" :loading="loading">
      Voir plus d’événements
    </v-btn>
  </section>
</template>

<script>
import EventItem from "@/components/Events/me/Item.vue";
import {mapGetters} from "vuex";

export default {
  components : {EventItem,},
  computed   : {
    ...mapGetters('feedEventStore', {
      items  : 'getItems',
      loading: 'getLoading',
      hasMore: 'getHasMore',
      error  : 'getError',
    }),
  },
  methods    : {
    load     : function () {
      this.$store.dispatch('feedEventStore/loadMore');
    },
    searching: function () {
      if (this.search.length === 0) {
        this.$store.dispatch('feedEventStore/items');
        return;
      }
      this.$store.dispatch('feedEventStore/search', this.search);
    },
  },
  data       : () => ({
    search: '',
  }),
  beforeMount: function () {
    this.$store.dispatch('feedEventStore/items').catch(() => {});
  },
}
</script>

<style scoped>

</style>