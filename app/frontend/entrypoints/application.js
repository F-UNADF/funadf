import {createApp} from 'vue';
import App from '../components/App.vue';
import store from '../store/index';

// Router
import admin_router from '../router/admin';
import intranet_router from '../router/intranet';
import votes_router from '../router/votes';
import me_router from '../router/me';
import PasswordIndex from "../components/Password/Index.vue";
import SessionIndex from "../components/Session/Index.vue";
import PasswordCreate from "../components/Password/Create.vue";

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import {
    VDataTable,
    VDataTableServer,
    VDataTableVirtual,
} from "vuetify/labs/VDataTable";
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

const vuetify = createVuetify({
    components,
    directives,
    defaults: {
        VDataTable: {
            fixedHeader: true,
            noDataText : 'Results not found',
        },
    },
});
const router = () => {
    let uris = window.location.hostname.split('.');
    let routes = votes_router;
    if (uris.length > 2) {
        let subdomain = uris[0];
        if (subdomain === 'admin') {
            routes = admin_router;
        } else if (subdomain.match(/uadpif|test|urb/)) {
            routes = intranet_router;
        } else if (subdomain === 'me') {
            routes = me_router;
        }
    }
    routes.addRoute(
        {
            path:      '/connexion',
            component: SessionIndex,
            name:      'connexion',
        }
    );
    routes.addRoute(
        {
            path:      '/mot-de-passe-oublie',
            component: PasswordIndex,
            name:      'forgotPassword',
        },
    );
    routes.addRoute(
        {
            path:      '/users/password/edit',
            component: PasswordCreate,
            name:      'createPassword',
        },
    );

    return routes;
};

const app = createApp(App);

app.use(vuetify)
.use(PerfectScrollbar)
.use(router())
.use(store);

app.mount('#app');