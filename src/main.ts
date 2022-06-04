import App from '@/RootComponent.vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import 'material-design-icons/iconfont/material-icons.css';
import { routeConfiguration } from '@/router/RouteConfiguration';
import { createRouter, createWebHistory } from 'vue-router';
//@ts-ignore
import moment from 'moment/min/moment-with-locales';

moment.locale('de');

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes: routeConfiguration, // short for `routes: routes`
    scrollBehavior() {
        return { top: 0 };
    },
});

const app = createApp(App);
app.config.globalProperties.$moment = moment;

app.use(createPinia()) // use pinia store
    .use(router)
    .mount('#app');
