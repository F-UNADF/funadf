<template>
  <div class="reading-width">
    <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" class="mb-3 px-2"
      @click="$router.push({ name: 'feed.index' })">
      Retour au fil d’actualité
    </v-btn>
    <v-alert v-if="error" type="warning" variant="tonal">
      Cet événement n’a pas pu être affiché. Il a peut-être été supprimé ou vous n’y avez pas accès.
    </v-alert>
    <v-skeleton-loader v-else-if="loading" type="card"></v-skeleton-loader>
    <EventDetail v-else :event="event" />
  </div>
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
      error: false,
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const response = await axios.get(`/api/events/${this.$route.params.id}`);
      this.event = response.data.event;
      this.loading = false;
    } catch (error) {
      this.error = true;
    }
  },
};
</script>
