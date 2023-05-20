import { RouteRecordRaw } from 'vue-router';
import Home from '@/components/pages/home/Home.vue';
import NewGroup from '@/components/pages/NewGroup.vue';
import GroupPage from '@/components/pages/group-page/GroupEntriesPage.vue';
import SettlementPage from '@/components/pages/settlement-page/SettlementPage.vue';
import Impressum from '@/components/pages/Impressum.vue';
import DatenschutzVue from '@/components/pages/Datenschutz.vue';
import NotFound from '@/components/pages/NotFound.vue';
import Invite from '@/components/pages/Invite.vue';

export const routeConfiguration: RouteRecordRaw[] = [
    { path: '/', component: Home },
    { path: '/new-group', component: NewGroup, meta: { breadCrumb: 'Neue Gruppe' } },
    { path: '/gruppe-:groupId', component: GroupPage, meta: { breadCrumb: 'Gruppe' }, name: 'entries' },
    {
        path: '/gruppe-:groupId/settlement',
        component: SettlementPage,
        meta: { breadCrumb: 'Abrechnung' },
        name: 'settlement',
        props: (route) => ({ groupCode: route.params['groupId'] }),
    },
    { path: '/gruppe-:groupId/invite', component: Invite, meta: { breadCrumb: 'Einladen' }, name: 'invite' },

    { path: '/impressum', component: Impressum, meta: { breadCrumb: 'Impressum' } },
    { path: '/datenschutz', component: DatenschutzVue, meta: { breadCrumb: 'Datenschutz' } },
    { path: '/:pathMatch(.*)*', component: NotFound, name: '404' },
];
