import App from '@/RootComponent.vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import 'materialize-css/dist/css/materialize.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import { RouteConfiguration } from '@/router/RouteConfiguration';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes: RouteConfiguration, // short for `routes: routes`
});

createApp(App)
    .use(createPinia()) // use pinia store
    .use(router)
    .mount('#app');
