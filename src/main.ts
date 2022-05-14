import App from '@/RootComponent.vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import 'materialize-css/dist/css/materialize.min.css';
import 'material-design-icons/iconfont/material-icons.css';

createApp(App)
    .use(createPinia()) // use pinia store
    .mount('#app');
