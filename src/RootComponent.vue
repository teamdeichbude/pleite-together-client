<template>
    <div id="root" class="">
        <nav>
            <div class="nav-wrapper teal darken-4">
                <div class="container">
                    <div class="col s12">
                        <router-link to="/" class="breadcrumb">Home</router-link>
                        <router-link v-for="crumb in crumbs" :key="crumb.path" :to="crumb.to" class="breadcrumb">{{
                            crumb.text
                        }}</router-link>
                    </div>
                </div>
            </div>
        </nav>
        <main class="main-content teal lighten-5">
            <router-view v-slot="{ Component }">
                <transition name="fade-page" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>
        <footer class="page-footer lime lighten-5">
            <div class="container">
                <div class="row">
                    <div class="col l6 s12">
                        <h5 class="black-text">Pleite Together</h5>
                        <p class="grey-text text-lighten-0">
                            Minim minim eu minim mollit ea id amet non ipsum culpa Lorem magna non. Nostrud deserunt
                            laborum cupidatat nulla est anim qui aute ea nulla qui commodo. Aliquip amet sint laboris
                            officia ipsum exercitation adipisicing do. Ut non mollit incididunt laboris nostrud et non
                            duis minim. Amet esse id eiusmod labore amet laborum ad cillum consectetur pariatur elit.
                        </p>
                    </div>
                    <div class="col l3 s12">
                        <h5 class="black-text">Der Ernst des Lebens</h5>
                        <ul>
                            <li><router-link class="teal-text" to="/datenschutz">Datenschutz</router-link></li>
                            <li><router-link class="teal-text" to="/impressum">Impressum</router-link></li>
                        </ul>
                    </div>
                    <div class="col l3 s12">
                        <h5 class="black-text">Sonstiges</h5>
                        <ul>
                            <li>
                                <a class="teal-text" href="#!">Lokale Daten löschen</a>
                            </li>
                            <li><a class="teal-text" href="mailto:deichbu@lucaelsen.de">Kontakt</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-copyright teal lighten-4">
                <div class="container teal-text">
                    Made with 💙<a class="teal-text text-lighten-0" href="https://deichbu.de">by deichbu.de</a>
                </div>
            </div>
        </footer>
    </div>
</template>

<script lang="ts" setup>
    import { computed, onMounted } from 'vue';
    import M from 'materialize-css';
    import { useRoute } from 'vue-router';

    onMounted(() => {
        M.AutoInit();
    });

    const route = useRoute();

    const crumbs = computed(() => {
        let pathArray = route.path.split('/');
        pathArray.shift();
        let breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
            const test = breadcrumbArray as any[];
            test.push({
                path: path,
                // @ts-ignore
                to: breadcrumbArray[idx - 1] ? '/' + breadcrumbArray[idx - 1].path + '/' + path : '/' + path,
                text: route.matched[idx]?.meta?.breadCrumb || path,
            });
            return breadcrumbArray;
        }, []);
        return breadcrumbs;
    });
</script>

<style lang="scss">
    @import '@/scss/globals.scss'; // only imported once in main component

    #root {
        display: flex;
        min-height: 100vh;
        min-width: 100vw;
        flex-direction: column;
        margin: 0;
        padding: 0;
        overflow: hidden;
        max-width: 100vw;
    }

    .main-content {
        flex-grow: 2;
    }

    .footer {
        flex-grow: 1;
    }
</style>
