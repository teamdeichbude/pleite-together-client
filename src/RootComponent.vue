<template>
    <div id="root">
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
    import { useUiStore } from '@/stores/UiStore';
    import { watch } from 'vue';

    const uiStore = useUiStore();
    watch(
        () => uiStore.modalOpen,
        (newValue) => {
            window.document.body.classList.toggle('inactive', newValue);
        }
    );
</script>

<style lang="scss">
    @import '@/scss/globals.scss'; // only imported once in main component

    #root {
        display: flex;
        min-width: 100vw;
        height: 100%;
        flex-direction: column;
        justify-content: space-between;
        margin: 0;
        padding: 0;
        max-width: 100vw;
        &::after {
            content: '';
            z-index: -1;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;

            background-color: $bg-color;
            background-image: linear-gradient($bg-color, $bg-color-gradient-end);
            height: 100%;
            margin: 0;
            background-repeat: no-repeat;
            background-attachment: fixed;
        }
    }

    .main-content {
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
