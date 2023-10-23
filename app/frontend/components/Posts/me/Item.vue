<template>
  <v-card variant="elevated" class="bg-surface">
    <v-card-item>
      <div class="d-flex gap-3 align-center">
        <v-avatar size="40">
          <img :src="'/logos/'+post.structure.id+'.png'" width="40" alt="avatar"/>
        </v-avatar>
        <div class="d-block d-sm-flex align-center gap-3">
          <h6 class="text-h6">{{ post.structure.name }}</h6>
          <v-icon size="x-small" color="grey lighten-5">mdi-circle</v-icon>
          <span class="text-subtitle-2 opacity-50">
            {{ dateFormat(post.post.created_at) }}
          </span>
        </div>
      </div>
      <div class="py-4 text-body-1 gap-3">
        <h3>{{ post.post.title }}</h3>
        <div v-html="post.post.content"></div>
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
            {{ attachment.split('/').pop() }}
          </v-btn>

        </v-col>
      </v-row>

      <!-- Like and comment count
      <div class="my-4 mt-5 d-flex align-center gap-3">
        <v-tooltip text="Like">
          <template v-slot:activator="{ props }">
            <v-btn
                @click="handlePostLikes(`${post?.id}`)"
                v-bind="props"
                icon
                :color="post?.data && post?.data.likes && post?.data.likes.like ? 'primary' : 'grey100'"
                variant="flat"
                size="x-small"
            >
              <ThumbUpIcon size="16" />
            </v-btn>
          </template>
        </v-tooltip>
        <span class="text-subtitle-1 font-weight-semibold">{{ post?.data && post?.data.likes && post?.data.likes.value }}</span>
        <v-tooltip text="Comment">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" color="secondary" variant="flat" size="x-small" @click="toggleCommentbox">
              <Message2Icon size="16" />
            </v-btn>
          </template>
        </v-tooltip>
        <span class="text-subtitle-1 font-weight-semibold">{{ post?.data.comments ? post?.data.comments.length : 0 }}</span>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon class="ml-auto" variant="text" size="small" v-bind="props"><ShareIcon size="16" /></v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, index) in shareitems" :key="index" :value="index">
              <template v-slot:prepend>
                <component :is="item.icon" stroke-width="1.5" size="20" />
              </template>
              <v-list-item-title class="ml-3">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>-->
    </v-card-item>
    <!--If Comment
    <div v-if="post?.data.comments" class="pa-5 pt-0">
      <div v-for="comments in post?.data.comments">
        <Comments :comments="comments" :postId="post?.id" />
      </div>
    </div>
    Comment Form
    <div v-if="showCommentBox">
      <v-divider />
      <div class="d-block d-sm-flex gap-3 align-center mb-4 px-4 pt-4">
        <v-avatar class="flex-shrink-0 d-none d-sm-block" size="33">
          <img :src="post?.profile.avatar" width="33" alt="avatar" />
        </v-avatar>
        <v-text-field variant="outlined" color="primary" v-model="searchValue" placeholder="Comment" hide-details></v-text-field>
        <v-btn
            color="primary"
            variant="flat"
            :disabled="searchValue === ''"
            class="mt-3 mt-sm-0"
            @click="onSubmit(post?.id, searchValue)"
        >
          Comment
        </v-btn>
      </div>
    </div>-->
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