import App from '@/RootComponent.vue';
import { createPinia, storeToRefs } from 'pinia';
import { createApp } from 'vue';

createApp(App)
    .use(createPinia()) // use pinia store
    .mount('#app');
