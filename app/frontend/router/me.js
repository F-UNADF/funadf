import { createRouter, createWebHistory } from "vue-router";
import FeedIndex from "../components/Feed/Index.vue";
import AnnuaireIndex from "../components/Annuaire/Index.vue";
import ProfileShow from "../components/Profile/Show.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/feed",
    },
    {
      path: "/feed",
      component: FeedIndex,
      name: "feed.index",
    },
    {
      path: "/mon-profil",
      component: ProfileShow,
      name: "profile.show",
    },
    {
      path: "/annuaire",
      component: AnnuaireIndex,
      name: "annuaire.index",
    },
  ],
});
