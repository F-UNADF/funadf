<template>
  <v-card @click="seeDetail()" :aria-label="`${event.title}, voir le détail`">
    <v-card-item>
      <div class="d-flex gap-3 align-center">
        <v-avatar size="40" class="me-3">
          <img :src="'/logos/'+event.structure.id+'.png'" width="40" alt="avatar"/>
        </v-avatar>
        <div class="d-block d-sm-flex align-center gap-3">
          <div class="text-subtitle-2 font-weight-medium">
            {{ event.structure.name }}
            <span v-if="event.category?.name" class="text-caption text-medium-emphasis ms-1">
              {{ event.category?.name }}
            </span>
          </div>
        </div>
      </div>
      <div class="pt-3">
        <h3 class="text-subtitle-1 font-weight-bold">
          {{ event.title }}
        </h3>
        <span class="text-body-2 text-medium-emphasis">
          Du {{ dateFormat(event.start_at) }} au {{ dateFormat(event.end_at) }}
        </span>
      </div>
    </v-card-item>

    <v-dialog v-model="detail" max-width="640">
      <EventDetail :event="event" @close="detail = false" :isDialog="true" />
    </v-dialog>
  </v-card>
</template>

<script>

import moment from "moment";
import EventDetail from "@/components/Events/me/Detail.vue";

export default {
  name   : "EventItem",
  props  : {
    event: {
      type    : Object,
      required: true,
    },
  },
  components: {
    EventDetail,
  },
  methods: {
    dateFormat: function (value) {
      return moment(value).format('DD/MM/YYYY HH:mm');
    },
    seeDetail : function () {
      this.detail = true;
    },
  },
  data   : () => ({
    detail: false,
  }),
}
</script>

<style scoped>

</style>