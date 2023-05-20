<template>
    <div id="root" class="">
        <Navigation></Navigation>
        <main class="main-content">
            <router-view v-slot="{ Component }">
                <transition name="fade-page" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>
        <footer>
            <div>Made with 💛 by <a href="https://deichbu.de">deichbu.de</a></div>

            <div class="hide">
                <h5>Pleite Together</h5>
                <p class="grey-text text-lighten-3">
                    Minim minim eu minim mollit ea id amet non ipsum culpa Lorem magna non. Nostrud deserunt laborum
                    cupidatat nulla est anim qui aute ea nulla qui commodo. Aliquip amet sint laboris officia ipsum
                    exercitation adipisicing do. Ut non mollit incididunt laboris nostrud et non duis minim. Amet esse
                    id eiusmod labore amet laborum ad cillum consectetur pariatur elit.
                </p>
            </div>

            <div>
                <ul>
                    <li><router-link to="/datenschutz">Datenschutz</router-link></li>
                    <li><router-link to="/impressum">Impressum</router-link></li>
                    <li><a href="mailto:kontakt@mariasoliman.de">Kontakt</a></li>
                </ul>
            </div>
        </footer>
    </div>
</template>

<script lang="ts" setup>
    import Navigation from './components/Navigation.vue';
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
        background-image: linear-gradient($bg-color, $bg-color-gradient-end);
    }

    .main-content {
        flex-grow: 3;
        min-height: 70vh;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 6rem 1.5rem 3rem 1.5rem;
    }

    footer {
        padding: 10px 20px;
        color: $header-bg-color;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;

        ul {
            list-style: none;
            display: flex;
            justify-content: center;
            margin: 0;
            padding: 0;
            li {
                padding: 0 10px;
                margin: 0;
            }
        }

        a {
            color: $link-color;
        }
        a:active,
        a:hover {
            color: $black;
            text-decoration: none;
        }
    }
</style>
