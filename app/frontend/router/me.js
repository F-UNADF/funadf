import {createRouter, createWebHistory} from 'vue-router'
import FeedIndex from '../components/Feed/Index.vue'

export default createRouter({
    history: createWebHistory(),
    routes : [
        {
            path     : '/',
            redirect : '/feed',
        },
        {
            path     : '/feed',
            component: FeedIndex,
            name     : 'feed.index',
        },
    ],
})
