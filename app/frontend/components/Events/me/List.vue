<template>
  <v-row class="mt-4">
    <v-col cols="12">
      <h3 class="text-h6 text-grey">
        <v-icon>mdi-calendar</v-icon>
        Prochains événements
      </h3>
    </v-col>
    <v-col cols="12" v-for="event in items" :key="event.id">
      <EventItem :event="event"/>
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
import EventItem from "@/components/Events/me/Item.vue";
import {mapGetters} from "vuex";

export default {
  components : {EventItem,},
  computed   : {
    ...mapGetters('feedEventStore', {
      items  : 'getItems',
      loading: 'getLoading',
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
    this.$store.dispatch('feedEventStore/items');
  },
}
</script>

<style scoped>

</style>