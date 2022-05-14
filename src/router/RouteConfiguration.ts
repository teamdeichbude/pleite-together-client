import { RouteRecordRaw } from 'vue-router';
import Home from '@/components/pages/home/Home.vue';
import Register from '@/components/pages/Register.vue';

export const RouteConfiguration: RouteRecordRaw[] = [
    { path: '/', component: Home },
    { path: '/kasse-:registerId', component: Register },
];
