import {createApp} from "vue";
import {createVuetify} from "vuetify";
import App from "../components/App.vue";
import store from "../store/index";
import "vuetify/styles";

// Router
import {createRouter, createWebHistory} from "vue-router";
import admin_router from "../router/admin";
import me_router from "../router/me";
import association_router from "../router/association";
import PasswordIndex from "../components/Password/Index.vue";
import SessionIndex from "../components/Session/Index.vue";
import PasswordCreate from "../components/Password/Create.vue";
import PrivacyPage from "../components/Pages/PrivacyPage.vue";

// Vuetify
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import {PerfectScrollbarPlugin} from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';

import "../scss/style.scss";

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "light",
        themes: {
            light: {
                colors: {
                    primary: "#015486",
                    secondary: "#058FE1",
                    success: "#36B37E",
                    info: "#8777D9",
                    warning: "#FFAB00",
                    error: "#FF5630",
                    background: "#F8F9FA",
                    surface: "#f8f9fa",
                    anchor: "#0d6efd",
                    white: "#ffffff",
                    black: "#000000",
                    blue: "#5E50F9",
                    indigo: "#6610f2",
                    purple: "#6a008a",
                    pink: "#E91E63",
                    red: "#f96868",
                    orange: "#f2a654",
                    yellow: "#f6e84e",
                    green: "#46c35f",
                    teal: "#58d8a3",
                    cyan: "#57c7d4",
                    gray: "#434a54",
                    grayLight: "#aab2bd",
                    grayLighter: "#e8eff4",
                    grayDark: "#0f1531",
                    lightText: "#495057",
                    darkText: "#091E42",
                    border: "#ebedf2",
                },
            },
        },
    },
});

let hostname = window.location.hostname; // Récupère le domaine actuel
let routes = me_router; // Route par défaut

// si hostname contains admin
if (hostname.includes('admin')){
    routes = admin_router;
} else if (hostname.includes('association')){
    routes = association_router;
}

// Ajout des routes globales
routes.addRoute({path: "/connexion", component: SessionIndex, name: "connexion"});
routes.addRoute({path: "/mot-de-passe-oublie", component: PasswordIndex, name: "forgotPassword"});
routes.addRoute({path: "/users/password/edit", component: PasswordCreate, name: "createPassword"});
routes.addRoute({path: "/privacy", component: PrivacyPage, name: "privacy"});

const router = createRouter({
    history: createWebHistory(),
    routes: routes.getRoutes(),
});

console.log(router);

// Guard de navigation
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");

    if (!token && !["/connexion", "/mot-de-passe-oublie", "/users/password/edit", "/privacy"].includes(to.path)) {
        next("/connexion"); // Redirige vers la page de connexion
    } else {
        next(); // Continue la navigation
    }
});

const app = createApp(App);

app.use(vuetify)
    .use(PerfectScrollbarPlugin)
    .use(router)
    .use(store);
app.mount("#app");
