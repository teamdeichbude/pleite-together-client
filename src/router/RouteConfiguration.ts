import { RouteRecordRaw } from 'vue-router';
import Home from '@/components/pages/home/Home.vue';
import Register from '@/components/pages/Register.vue';
import Impressum from '@/components/pages/Impressum.vue';
import DatenschutzVue from '@/components/pages/Datenschutz.vue';

export const RouteConfiguration: RouteRecordRaw[] = [
    { path: '/', component: Home },
    { path: '/kasse-:registerId', component: Register, meta: { breadCrumb: 'Kasse' } },
    { path: '/impressum', component: Impressum, meta: { breadCrumb: 'Impressum' } },
    { path: '/datenschutz', component: DatenschutzVue, meta: { breadCrumb: 'Datenschutz' } },
];
