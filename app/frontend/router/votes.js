import {createRouter, createWebHistory} from 'vue-router'
import VotesIndex from '../components/Votes/Index.vue'
import VotesShow from '../components/Votes/Show.vue'
import SessionIndex from "../components/Session/Index.vue";

export default createRouter({
    history: createWebHistory(),
    routes : [
        {
            path     : '/',
            redirect : '/campaigns',
        },
        {
            path:      '/connexion',
            component: SessionIndex,
            name:      'connexion',
        },
        {
            path     : '/campaigns',
            component: VotesIndex,
            name     : 'votes.index',
        },
        {
            path     : '/campaigns/:id',
            component: VotesShow,
            name     : 'votes.show',
        }
    ],
})
