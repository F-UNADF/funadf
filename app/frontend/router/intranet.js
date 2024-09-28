import { createRouter, createWebHistory } from 'vue-router'
import EventsIndex from '../components/Events/Index.vue'
import UsersIndex from "@/components/Users/Index.vue";
import ChurchesIndex from "../components/Churches/Index.vue";
import CampaignsIndex from "../components/Campaigns/Index.vue";
import PostsIndex from "../components/Posts/Index.vue";
import SessionIndex from "../components/Session/Index.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: { name: 'users' },
        },
        {
            path: '/users',
            component: UsersIndex,
            name: 'users',
        },
        {
            path: '/churches',
            component: ChurchesIndex,
            name: 'churches',
        },
        {
            path: '/events',
            component: EventsIndex,
            name: 'events',
        },
        {
            path: '/campaigns',
            component: CampaignsIndex,
            name: 'campaigns',
        },
        {
            path: '/posts',
            component: PostsIndex,
            name: 'posts',
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