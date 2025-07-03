<template>
  <v-card @click="seeDetail()">
    <v-card-item>
      <div class="d-flex gap-3 align-center">
        <v-avatar size="40" class="me-3">
          <img :src="'/logos/'+event.structure.id+'.png'" width="40" alt="avatar"/>
        </v-avatar>
        <div class="d-block d-sm-flex align-center gap-3">
          <h6 class="text-h6">
            {{ event.structure.name }}
            <span class="text-subtitle-2 opacity-50">
              {{ event.category?.name }}
            </span>
          </h6>
        </div>
      </div>
      <div class="py-4 text-body-1 gap-3">
        <h3>
          {{ event.title }}
        </h3>
        <span class="text-subtitle-2 opacity-50">
          Du {{ dateFormat(event.start_at) }} au {{ dateFormat(event.end_at) }}
        </span>
      </div>
    </v-card-item>

    <v-dialog v-model="detail" max-width="40%" min-height="30vh">
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