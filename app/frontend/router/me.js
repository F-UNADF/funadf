import { createRouter, createWebHistory } from "vue-router";
import FeedIndex from "../components/Feed/Index.vue";
import AnnuaireIndex from "../components/Annuaire/Index.vue";
import ProfileShow from "../components/Profile/Show.vue";

const router = createRouter({
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

// Ajout du guard avant chaque navigation
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  // Si le token est null et que la route n'est pas "/connexion"
  if (!token && to.path !== '/connexion') {
    next('/connexion'); // Redirige vers la page de connexion
  } else {
    next(); // Continue la navigation
  }
});

export default router;