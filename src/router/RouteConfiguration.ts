import { RouteRecordRaw } from 'vue-router';
import Home from '@/components/pages/home/Home.vue';
import NewGroup from '@/components/pages/NewGroup.vue';
import GroupPage from '@/components/pages/GroupPage.vue';
import Impressum from '@/components/pages/Impressum.vue';
import DatenschutzVue from '@/components/pages/Datenschutz.vue';

export const routeConfiguration: RouteRecordRaw[] = [
    { path: '/', component: Home },
    { path: '/new-group', component: NewGroup, meta: { breadCrumb: 'Neue Gruppe' } },
    { path: '/gruppe-:groupId', component: GroupPage, meta: { breadCrumb: 'Gruppe' } },
    { path: '/impressum', component: Impressum, meta: { breadCrumb: 'Impressum' } },
    { path: '/datenschutz', component: DatenschutzVue, meta: { breadCrumb: 'Datenschutz' } },
];
