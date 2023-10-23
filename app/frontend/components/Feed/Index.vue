<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="8" md="6" sm="12">
        <PostList></PostList>
      </v-col>
      <v-col cols="12" lg="4" md="6" sm="12">
        <div class="events bg-white ps-5">
          <EventList></EventList>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PostList from "../Posts/me/List.vue";
import EventList from "../Events/me/List.vue";

export default {
  name      : "FeedIndex",
  components: {
    PostList,
    EventList
  },
}

</script>

<style scoped>
.events {
  padding-right: 15px;
  overflow-y: scroll;
}

/* For large and medium screens */
@media (min-width: 768px) { /* Adjust this value according to your breakpoints */
  .events {
    position: fixed;
    width: 350px;
    padding-top: 80px;
    right: 0;
    top: 0;
    bottom: 0;
    border-left: solid 1px #ccc;
  }
}

/* For small screens */
@media (max-width: 767px) { /* Adjust this value according to your breakpoints */
  .events {
    position: static;
  }
}


</style>