<template>
    <div id="root" class="">
        <nav>
            <div class="nav-wrapper">
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
        <main class="main-content">
            <router-view v-slot="{ Component }">
                <transition name="fade-page" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>
        <footer class="page-footer">
            <div class="container">
                <div class="row">
                    <div class="col l6 s12">
                        <h5>Pleite Together</h5>
                        <p class="grey-text text-lighten-3">
                            Minim minim eu minim mollit ea id amet non ipsum culpa Lorem magna non. Nostrud deserunt
                            laborum cupidatat nulla est anim qui aute ea nulla qui commodo. Aliquip amet sint laboris
                            officia ipsum exercitation adipisicing do. Ut non mollit incididunt laboris nostrud et non
                            duis minim. Amet esse id eiusmod labore amet laborum ad cillum consectetur pariatur elit.
                        </p>
                    </div>
                    <div class="col l3 s12">
                        <h5>Der Ernst des Lebens</h5>
                        <ul>
                            <li><router-link to="/datenschutz">Datenschutz</router-link></li>
                            <li><router-link to="/impressum">Impressum</router-link></li>
                        </ul>
                    </div>
                    <div class="col l3 s12">
                        <h5>Sonstiges</h5>
                        <ul>
                            <li>
                                <a href="#!">Lokale Daten löschen</a>
                            </li>
                            <li><a href="mailto:deichbu@lucaelsen.de">Kontakt</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-copyright">
                <div class="container">Made with 💛 by <a href="https://deichbu.de">deichbu.de</a></div>
            </div>
        </footer>
    </div>
</template>

<script lang="ts" setup>
    import { computed, Ref } from 'vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();

    const crumbs: Ref<any[]> = computed(() => {
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
        background-color: $bg-color;
    }

    .nav-wrapper {
        background-color: $header-bg-color;
    }

    .main-content {
        flex-grow: 3;
        min-height: 70vh;
        display: flex;
        align-items: center;
    }

    .footer {
        flex-grow: 1;
    }
</style>
