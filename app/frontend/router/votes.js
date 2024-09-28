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