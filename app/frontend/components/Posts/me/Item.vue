<template>
  <v-card variant="elevated" class="bg-surface">

    <div class="cover" v-if="hasCover">
      <div
          class="cover-bg"
          :style="{ backgroundImage: `url(${coverImage})` }"
      ></div>

      <img :src="coverImage" alt="Cover" class="cover-img" />
    </div>

    <v-card-item>
      <!-- Header -->
      <div class="d-flex flex-wrap ga-3 align-center">
        <v-avatar size="40">
          <img :src="structureLogo" width="40" :alt="structureName" @error="onLogoError" />
        </v-avatar>

        <div class="d-block d-sm-flex flex-wrap align-center ga-3 ml-3">
          <h6 class="text-h6">{{ structureName }}</h6>
          <v-icon size="x-small" color="grey lighten-5 mx-3">mdi-circle</v-icon>
          <span class="text-subtitle-2 opacity-50">{{ formattedDate }}</span>
          <em v-if="postPinned" class="small text-grey ml-3">Actualité épinglée</em>
        </div>
      </div>

      <!-- Body -->
      <div class="py-4 text-body-1 gap-3">
        <h3>{{ postTitle }}</h3>
        <div v-html="safeContent"></div>
      </div>

      <!-- Gallery -->
      <v-row v-if="hasImages">
        <v-col
            v-for="(photo, index) in gridImages"
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
              :alt="imageAlt(index)"
              @click="openCarousel(index)"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-5" />
              </v-row>
            </template>

            <!-- Overlay -->
            <div
                class="d-flex align-center justify-center fill-height bg-grey-lighten-3 opacity-50 cursor-pointer"
            >
              <span class="text-h6 font-weight-bold">
                <v-icon v-if="index < 2 && extraCount === 0">mdi-image-search</v-icon>
                <span v-else-if="index === 2 && extraCount > 0">{{ extraCount }}+</span>
                <v-icon v-else>mdi-image-search</v-icon>
              </span>
            </div>
          </v-img>
        </v-col>
      </v-row>

      <!-- Attachments -->
      <v-row v-if="hasAttachments" class="pb-3">
        <v-col
            v-for="(attachment, index) in attachments"
            :key="index"
            class="d-flex child-flex"
            cols="4"
        >
          <v-btn :href="attachment" target="_blank" elevation="1" block>
            <v-icon>mdi-download</v-icon>
            Pièce jointe {{ index + 1 }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-item>

    <!-- Dialog + Carousel (lazy mount) -->
    <v-dialog v-model="carouselDialog" max-width="50%">
      <v-card v-if="carouselDialog">
        <v-card-title>
          <v-btn icon size="small" color="red" @click="carouselDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-carousel v-model="carouselIndex" show-arrows="hover" hide-delimiters>
            <v-carousel-item v-for="(photo, index) in images" :key="index">
              <v-img :src="photo" :lazy-src="photo" class="bg-grey-lighten-2" :alt="imageAlt(index)">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey-lighten-5" />
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
// Si tu veux vraiment sécuriser v-html:
// import DOMPurify from "dompurify";

export default {
  name: "PostItem",
  props: {
    post: { type: Object, required: true },
  },
  data() {
    return {
      carouselDialog: false,
      carouselIndex: 0,
      logoFallbackUsed: false,
    };
  },
  computed: {
    images() {
      const imgs = this.post && Array.isArray(this.post.images) ? this.post.images : [];
      return imgs.filter(Boolean);
    },
    attachments() {
      const atts = this.post && Array.isArray(this.post.attachments) ? this.post.attachments : [];
      return atts.filter(Boolean);
    },
    hasImages() {
      return this.images.length > 0;
    },
    hasCover() {
      return this.images.length > 0;
    },
    coverImage() {
      return this.images[0] || null;
    },
    gridImages() {
      // 2 premières + une 3e case (soit 3e image, soit rien)
      return this.images.slice(0, Math.min(3, this.images.length));
    },
    extraCount() {
      return Math.max(0, this.images.length - 3);
    },
    hasAttachments() {
      return this.attachments.length > 0;
    },
    structureName() {
      return (this.post && this.post.structure && this.post.structure.name) || "Structure";
    },
    structureLogo() {
      if (this.logoFallbackUsed) return "/logos/default.png";
      const id = this.post && this.post.structure && this.post.structure.id;
      return id ? `/logos/${id}.png` : "/logos/default.png";
    },
    formattedDate() {
      const v = this.post && this.post.created_at;
      return v ? moment(v).format("DD/MM/YYYY HH:mm") : "";
    },
    postTitle() {
      return (this.post && this.post.title) || "";
    },
    postPinned() {
      return !!(this.post && this.post.pinned);
    },
    safeContent() {
      const html = (this.post && this.post.content) || "";
      // Si tu branches DOMPurify:
      // return DOMPurify.sanitize(html);
      return html;
    },
  },
  methods: {
    openCarousel(index) {
      this.carouselIndex = index;
      this.carouselDialog = true;
    },
    imageAlt(index) {
      return `${this.postTitle || "Image"} (${index + 1})`;
    },
    onLogoError() {
      this.logoFallbackUsed = true;
    },
  },
};
</script>

<style scoped>
.cover {
  position: relative;
  overflow: hidden;
  height: 300px;
  background-color: #251A7A;
}

.cover-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center center;
  filter: blur(20px);
  opacity: 0.9;
  transform: scale(1.1); /* évite les bords dégueu du blur */
}

.cover-img {
  position: relative;
  z-index: 1;
  display: block;
  margin: 0 auto;
  height: 100%;
}
</style>