import { createRouter, createWebHistory } from "vue-router";
import EventsIndex from "../components/Events/Index.vue";
import AssociationsIndex from "../components/Associations/Index.vue";
import CampaignsIndex from "../components/Campaigns/Index.vue";
import PostsIndex from "../components/Posts/Index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: { name: "campaigns" },
    },
    {
      path: "/associations",
      component: AssociationsIndex,
      name: "associations",
    },
    {
      path: "/events",
      component: EventsIndex,
      name: "events",
    },
    {
      path: "/campaigns",
      component: CampaignsIndex,
      name: "campaigns",
    },
    {
      path: "/posts",
      component: PostsIndex,
      name: "posts",
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