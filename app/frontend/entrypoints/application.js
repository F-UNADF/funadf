import {createApp} from 'vue';
import App from '../components/App.vue';
import router from '../router/index';
import store from '../store/index';

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import VueFeather from 'vue-feather';

const vuetify = createVuetify({
    components,
    directives,
    defaults: {
        VDataTable: {
            fixedHeader: true,
            noDataText: 'Results not found',
        },
    },
});

const app = createApp(App);

app.use(vuetify)
    .use(PerfectScrollbar)
    .use(VueFeather)
    .use(router)
    .use(store);

app.mount('#app');