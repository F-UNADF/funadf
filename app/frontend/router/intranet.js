import {createRouter, createWebHistory} from 'vue-router'
import HomePage from '../components/Pages/Home.vue'
import EventsIndex from '../components/Events/Index.vue'
import UsersIndex from "../components/Users/Index.vue";
import ChurchesIndex from "../components/Churches/Index.vue";
import CampaignsIndex from "../components/Campaigns/Index.vue";

export default createRouter({
    history: createWebHistory(),
    routes : [
        {
            path     : '/',
            component: HomePage,
            name     : 'home',
        },
        {
            path     : '/users',
            component: UsersIndex,
            name     : 'users',
        },
        {
            path     : '/churches',
            component: ChurchesIndex,
            name     : 'churches',
        },
        {
            path     : '/events',
            component: EventsIndex,
            name     : 'events',
        },
        {
            path     : '/campaigns',
            component: CampaignsIndex,
            name     : 'campaigns',
        },
    ],
})
