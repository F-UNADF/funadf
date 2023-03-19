import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/Pages/Home.vue'
import UsersIndex from '../components/Users/Index.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: HomePage,
            name: 'home',
        },
        {
            path: '/users',
            component: UsersIndex,
            name: 'users',
        },
    ],
})
