<template>
  <v-container>
    <v-btn variant="text" color="primary" class="small mb-3" @click="$router.push({ name: 'feed.index' })">
      <v-icon left>mdi-arrow-left</v-icon>
      Retour au feed
    </v-btn>
    <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
    <EventDetail v-else :event="event" />
  </v-container>
</template>

<script>
import axios from 'axios';
import EventDetail from '@/components/Events/me/Detail.vue';

export default {
  name: 'EventsShow',
  components: {
    EventDetail,
  },
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      event: null,
      loading: true,
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const response = await axios.get(`/api/events/${this.$route.params.id}`);
      this.event = response.data.event;
      this.loading = false;
    } catch (error) {
      console.error("Erreur lors du chargement du event :", error);
    }
  },
};
</script>
