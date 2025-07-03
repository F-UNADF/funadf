<template>
  <v-card variant="elevated" class="bg-surface">
    <v-card-item>
      <div class="d-flex flex-wrap ga-3 align-center">
        <v-avatar size="40">
          <img :src="'/logos/'+post.structure.id+'.png'" width="40" alt="avatar"/>
        </v-avatar>
        <div class="d-block d-sm-flex flex-wrap align-center ga-3 ml-3">
          <h6 class="text-h6">{{ post.structure.name }}</h6>
          <v-icon size="x-small" color="grey lighten-5 mx-3">mdi-circle</v-icon>
          <span class="text-subtitle-2 opacity-50">
            {{ dateFormat(post.created_at) }}
          </span>
          <em v-if="post.pinned" class="small text-grey ml-3">
            Actualité épinglée
          </em>
        </div>
      </div>
      <div class="py-4 text-body-1 gap-3">
        <h3>{{ post.title }}</h3>
        <div v-html="post.content"></div>
      </div>
      <!---If Images -->
      <v-row v-if="post?.images">
        <v-col
            v-for="(photo, index) in post?.images.slice(0, 2)"
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
              @click="carouselDialog = true"
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
            <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3 opacity-50 cursor-pointer">
              <span class="text-h6 font-weight-bold">
                <v-icon>image-search</v-icon>
              </span>
            </div>
          </v-img>
        </v-col>
        <v-col
            v-if="post?.images.length > 2"
            class="d-flex child-flex"
            cols="4"
        >
          <v-img
              :src="post?.images[2]"
              :lazy-src="post?.images[2]"
              aspect-ratio="1"
              cover
              class="bg-grey-lighten-2"
              @click="carouselDialog = true"
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
            <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3 opacity-50 cursor-pointer">
              <span class="text-h6 font-weight-bold">{{ post?.images.length - 3 }}+</span>
            </div>
          </v-img>
        </v-col>
      </v-row>

      <!---If Attachments -->
      <v-row v-if="post?.attachments" class="pb-3">
        <v-col
            v-for="(attachment, index) in post?.attachments"
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
            Pièce jointe {{ index + 1 }}
          </v-btn>

        </v-col>
      </v-row>
    </v-card-item>

    <v-dialog v-model="carouselDialog" max-width="50%">
      <v-card>
        <v-card-title>
          <v-btn icon size="small" color="red" @click="carouselDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-carousel show-arrows="hover" hide-delimiters>
            <v-carousel-item v-for="(photo, index) in post?.images" :key="index">
              <v-img
                  :src="photo"
                  :lazy-src="photo"
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
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import moment from "moment/moment";

export default {
  name   : "PostItem",
  props  : {
    post: {
      type    : Object,
      required: true,
    },
  },
  methods: {
    dateFormat: function (value) {
      return moment(value).format('DD/MM/YYYY HH:mm');
    },
  },
  data   : () => ({
    carouselDialog: false,
  }),
}
</script>