import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/Pages/Home.vue";
import UsersIndex from "../components/Users/Index.vue";
import ChurchesIndex from "../components/Churches/Index.vue";
import AssociationsIndex from "../components/Associations/Index.vue";
import CampaignsIndex from "../components/Campaigns/Index.vue";
import EventsIndex from "../components/Events/Index.vue";
import PostsIndex from "../components/Posts/Index.vue";
import RolesIndex from "../components/Roles/Index.vue";
import MeetingsIndex from "../components/Meetings/Index.vue";
import FeesIndex from "../components/Fees/Index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: HomePage,
      name: "home",
    },
    {
      path: "/users",
      component: UsersIndex,
      name: "users",
    },
    {
      path: "/churches",
      component: ChurchesIndex,
      name: "churches",
    },
    {
      path: "/associations",
      component: AssociationsIndex,
      name: "associations",
    },
    {
      path: "/campaigns",
      component: CampaignsIndex,
      name: "campaigns",
    },
    {
      path: "/events",
      component: EventsIndex,
      name: "events",
    },
    {
      path: "/posts",
      component: PostsIndex,
      name: "posts",
    },
    {
      path: "/fees",
      component: FeesIndex,
      name: "fees",
    },
    {
      path: "/roles",
      component: RolesIndex,
      name: "roles",
    },
    {
      path: "/meetings",
      component: MeetingsIndex,
      name: "meetings",
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