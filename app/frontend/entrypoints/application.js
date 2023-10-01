import {createApp} from 'vue';
import App from '../components/App.vue';
import store from '../store/index';

// Router
import admin_router from '../router/admin';
import intranet_router from '../router/intranet';
import votes_router from '../router/votes';

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
        } else if (subdomain === 'uadpif') {
            routes = intranet_router;
        }
    }
    return routes;
};

const app = createApp(App);

app.use(vuetify)
.use(PerfectScrollbar)
.use(router())
.use(store);

app.mount('#app');