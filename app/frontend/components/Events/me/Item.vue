<template>
  <v-card variant="tonal" :color="event.event?.category?.color" @click="seeDetail()">
    <v-card-item>
      <div class="d-flex gap-3 align-center">
        <v-avatar size="40">
          <img :src="'/logos/'+event.structure.id+'.png'" width="40" alt="avatar"/>
        </v-avatar>
        <div class="d-block d-sm-flex align-center gap-3">
          <h6 class="text-h6">{{ event.structure.name }}</h6>
          <v-icon size="x-small" :color="event.event?.category?.color">mdi-circle</v-icon>
          <span class="text-subtitle-2 opacity-50">
            {{ event.event?.category?.name }}
          </span>
        </div>
      </div>
      <div class="py-4 text-body-1 gap-3">
        <h3>
          {{ event.event.title }}
        </h3>
        <span class="text-subtitle-2 opacity-50">
          Du {{ dateFormat(event.event.start_at) }} au {{ dateFormat(event.event.end_at) }}
        </span>
      </div>
      <!---If Images -->

      <!---If Attachments -->
    </v-card-item>

    <v-dialog v-model="detail" max-width="40%" min-height="30vh">
      <v-card variant="outlined" class="bg-white" :color="event.event?.category?.color" >
        <v-card-title>
          <v-avatar size="50" class="me-3">
            <img :src="'/logos/'+event.structure.id+'.png'" width="50" alt="avatar"/>
          </v-avatar>
          {{ event.event?.title }}
        </v-card-title>
        <v-card-subtitle>
          {{ event.event?.category?.name }}
          <v-icon size="x-small" :color="event.event?.category?.color">mdi-circle</v-icon>
          {{ event.structure.name }}
        </v-card-subtitle>
        <v-card-text>
          <div v-html="event.event?.description"></div>

          <v-row v-if="event?.images">
            <v-col
                v-for="(photo, index) in event?.images"
                :key="index"
                class="d-flex child-flex"
                cols="4"
            >
              <v-img
                  :src="photo"
                  :lazy-src="photo"
                  aspect-ratio="1"
                  cover
                  class="bg-grey-lighten-2"
              >
                <template v-slot:placeholder>
                  <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                  >
                    <v-progress-circular
                        indeterminate
                        color="grey-lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-col>
          </v-row>

          <v-row v-if="event?.attachments" class="pb-3">
            <v-col
                v-for="(attachment, index) in event?.attachments"
                :key="index"
                class="d-flex child-flex"
                cols="4"
            >
              <v-btn
                  :href="attachment"
                  target="_blank"
                  elevation="1"
                  block>
                <v-icon>mdi-download</v-icon>
                {{ attachment.split('/').pop() }}
              </v-btn>

            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="detail = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>

import moment from "moment";

export default {
  name   : "EventItem",
  props  : {
    event: {
      type    : Object,
      required: true,
    },
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