import { createRouter, createWebHistory } from "vue-router";
import VotesIndex from "../components/Votes/Index.vue";
import VotesShow from "../components/Votes/Show.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/campaigns",
    },
    {
      path: "/campaigns",
      component: VotesIndex,
      name: "votes.index",
    },
    {
      path: "/campaigns/:id",
      component: VotesShow,
      name: "votes.show",
    },
  ],
});

export default router;