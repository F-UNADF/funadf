import { createApp } from "vue";
import { createVuetify } from "vuetify";
import App from "../components/App.vue";
import store from "../store/index";
import "vuetify/styles";

// Router
import { createRouter, createWebHistory } from "vue-router";
import admin_router from "../router/admin";
import intranet_router from "../router/intranet";
import votes_router from "../router/votes";
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

import PerfectScrollbar from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "light",
        themes: {
            light: {
                colors: {
                    primary: "#b66dff",
                    secondary: "#c3bdbd",
                    success: "#1bcfb4",
                    info: "#198ae3",
                    warning: "#fed713",
                    error: "#fe7c96",
                    background: "#f1f1f1",
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
                    darkText: "#343a40",
                    border: "#ebedf2",
                },
            },
        },
    },
});

let uris = window.location.hostname.split(".");
let routes = votes_router;
if (uris.length > 2) {
    let subdomain = uris[0];
    if (subdomain === "admin") {
        routes = admin_router;
    } else if (subdomain === "association") {
        routes = association_router;
    } else if (subdomain.match(/uadpif|test|urb/)) {
        routes = intranet_router;
    } else if (subdomain === "me") {
        routes = me_router;
    }
}

// Ajout des routes globales
routes.addRoute({ path: "/connexion", component: SessionIndex, name: "connexion" });
routes.addRoute({ path: "/mot-de-passe-oublie", component: PasswordIndex, name: "forgotPassword" });
routes.addRoute({ path: "/users/password/edit", component: PasswordCreate, name: "createPassword" });
routes.addRoute({ path: "/privacy", component: PrivacyPage, name: "privacy" });

const router = createRouter({
    history: createWebHistory(),
    routes: routes.getRoutes(),
});

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

app.use(vuetify).use(PerfectScrollbar).use(router).use(store);
app.mount("#app");
