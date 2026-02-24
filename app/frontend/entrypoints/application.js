import {createApp} from "vue";
import {createVuetify} from "vuetify";
import App from "../components/App.vue";
import store from "../store/index";
import "vuetify/styles";

// Router
import {createRouter, createWebHistory} from "vue-router";
import routes from "../router/router";
import PasswordIndex from "../components/Password/Index.vue";
import SessionIndex from "../components/Session/Index.vue";
import PasswordCreate from "../components/Password/Create.vue";
import PrivacyPage from "../components/Pages/PrivacyPage.vue";

// Vuetify
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import i18n from "../i18n/index.js";

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
                    // Vuetify semantic
                    primary: "#251A7A",      // Bleu marine ADD
                    secondary: "#798AF4",    // Bleu
                    success: "#9CB828",      // Ministères
                    info: "#7DC3FF",         // Support
                    warning: "#FFB52E",      // Évènements
                    error: "#FF4E46",        // Rouge

                    background: "#FCFCFC",   // Blanc
                    surface: "#FFFFFF",      // Surface (cards)
                    anchor: "#798AF4",       // liens (ou primary si tu veux plus institutionnel)

                    // Utility
                    white: "#FFFFFF",
                    black: "#050105",

                    // Brand / accents
                    blue: "#798AF4",
                    indigo: "#0F1053",       // Bleu nuit
                    purple: "#774FFF",       // MI+
                    pink: "#FF7071",         // Rouge clair (accent doux)
                    red: "#FF4E46",
                    orange: "#FF6A4D",       // Communication
                    yellow: "#FFB52E",
                    green: "#9CB828",
                    teal: "#7DC3FF",
                    cyan: "#B0B8F9",         // Bleu clair

                    // Neutrals (lisibilité)
                    gray: "#7F84A2",
                    grayLight: "#A9AFC8",    // neutre dérivé (entre gris et gris clair)
                    grayLighter: "#E1E5F6",  // Gris clair charte
                    grayDark: "#0F1053",

                    // Text & borders
                    lightText: "#7F84A2",    // texte secondaire
                    darkText: "#050105",     // texte principal
                    border: "#E1E5F6",
                },
            },
            dark: {
                colors: {
                    primary: "#B0B8F9",      // CTA lisibles sur fond sombre
                    secondary: "#798AF4",
                    success: "#9CB828",
                    info: "#7DC3FF",
                    warning: "#FFB52E",
                    error: "#FF7071",        // rouge clair en dark

                    background: "#0F1053",   // Bleu nuit
                    surface: "#251A7A",      // Bleu marine (cards)
                    anchor: "#B0B8F9",

                    white: "#FCFCFC",
                    black: "#050105",

                    blue: "#798AF4",
                    indigo: "#0F1053",
                    purple: "#774FFF",
                    pink: "#FF7071",
                    red: "#FF4E46",
                    orange: "#FF6A4D",
                    yellow: "#FFB52E",
                    green: "#9CB828",
                    teal: "#7DC3FF",
                    cyan: "#B0B8F9",

                    gray: "#7F84A2",
                    grayLight: "#B0B8F9",    // en dark, “light” doit vraiment éclairer
                    grayLighter: "#251A7A",
                    grayDark: "#0F1053",

                    lightText: "#B0B8F9",
                    darkText: "#FCFCFC",
                    border: "#251A7A",
                },
            }
        },
    },
});

// Ajout des routes globales
routes.addRoute({path: "/connexion", component: SessionIndex, name: "connexion"});
routes.addRoute({path: "/mot-de-passe-oublie", component: PasswordIndex, name: "forgotPassword"});
routes.addRoute({path: "/users/password/edit", component: PasswordCreate, name: "createPassword"});
routes.addRoute({path: "/privacy", component: PrivacyPage, name: "privacy"});

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

app.use(vuetify)
    .use(i18n)
    .use(PerfectScrollbarPlugin)
    .use(router)
    .use(store);
app.mount("#app");
