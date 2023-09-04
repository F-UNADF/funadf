import {createApp} from 'vue';
import App from '../components/App.vue';
import store from '../store/index';

// Router
import admin_router from '../router/admin';
import intranet_router from '../router/intranet';

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
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
    const host = window.location.host;
    const subdomain = host.split('.')[0];
    let routes;
    if (subdomain === 'admin') {
        routes = admin_router;
    } else if (subdomain === 'uadpif') {
        routes = intranet_router;
    } else {
        // If you want to do something else just comment the line below
        routes = intranet_router;
    }
    return routes;
};

const app = createApp(App);

app.use(vuetify)
.use(PerfectScrollbar)
.use(router())
.use(store);

app.mount('#app');