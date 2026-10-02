<template>
  <v-row class="feed">
    <v-col cols="12" md="7" lg="8">
      <div class="feed__posts">
        <PostList></PostList>
      </div>
    </v-col>
    <v-col cols="12" md="5" lg="4">
      <aside class="feed__events" aria-labelledby="feed-events-title">
        <EventList></EventList>
      </aside>
    </v-col>
  </v-row>
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
.feed__posts {
  max-width: 760px;
}

/* La colonne des événements reste visible pendant qu'on fait défiler le fil */
@media (min-width: 960px) {
  .feed__events {
    position: sticky;
    top: 88px;
  }
}
</style>
