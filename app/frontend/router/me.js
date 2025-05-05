import { createRouter, createWebHistory } from "vue-router";
import FeedIndex from "../components/Feed/Index.vue";
import AnnuaireIndex from "../components/Annuaire/Index.vue";
import ProfileShow from "../components/Profile/Show.vue";
import DocumentsIndex from "../components/Documents/Me/Index.vue";
import VotesIndex from "../components/Votes/Index.vue";
import VotesShow from "../components/Votes/Show.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/feed",
      component: FeedIndex,
      name: "feed.index",
    },
    {
      path: "/mon-profil",
      component: ProfileShow,
      name: "profile.index",
    },
    {
      path: "/annuaire",
      component: AnnuaireIndex,
      name: "annuaire.index",
    },
    {
      path: "/documents",
      component: DocumentsIndex,
      name: "documents.index",
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