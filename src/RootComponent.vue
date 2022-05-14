<template>
    <div id="root" class="">
        <main class="main-content teal lighten-5">
            <article class="container">
                <section class="section">
                    <h1>hi</h1>
                    <div class="row create-register">
                        <button class="waves-effect waves-light btn disabled">
                            <i class="material-icons left">create_new_folder</i>Neue Kasse erstellen
                        </button>
                    </div>
                </section>
                <div class="divider"></div>
                <section class="section">
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="access-code" type="text" class="validate" />
                            <label for="access-code">Accesscode</label>
                            <span class="helper-text" data-error="wrong" data-success="right"
                                >Gib deinen Zugangscode ein</span
                            >
                        </div>
                        <div class="input-field col s6">
                            <button class="waves-effect waves-light btn">
                                <i class="material-icons left">subdirectory_arrow_right</i>Einer Kasse beitreten
                            </button>
                        </div>
                    </div>
                </section>
                <div class="divider"></div>
                <section class="section">
                    <div class="row">
                        <h5>Zuletzt auf diesem Gerät besuchte Kassen</h5>

                        <div class="container col s12">
                            <ul class="collection">
                                <li class="collection-item avatar">
                                    <i class="material-icons circle teal">play_arrow</i>
                                    <span class="title">Title</span>
                                    <p>
                                        Kassenname <br />
                                        Non nisi aliquip aute labore velit esse Lorem dolore.
                                    </p>
                                    <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
                                </li>
                                <li class="collection-item avatar">
                                    <i class="material-icons circle teal">play_arrow</i>
                                    <span class="title">Title</span>
                                    <p>
                                        Kassenname <br />
                                        Non nisi aliquip aute labore velit esse Lorem dolore.
                                    </p>
                                    <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
                                </li>
                                <li class="collection-item avatar">
                                    <i class="material-icons circle teal">play_arrow</i>
                                    <span class="title">Title</span>
                                    <p>
                                        Kassenname <br />
                                        Non nisi aliquip aute labore velit esse Lorem dolore.
                                    </p>
                                    <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
                                </li>
                                <li class="collection-item avatar">
                                    <i class="material-icons circle teal">play_arrow</i>
                                    <span class="title">Title</span>
                                    <p>
                                        Kassenname <br />
                                        Non nisi aliquip aute labore velit esse Lorem dolore.
                                    </p>
                                    <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </article>
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
                            <li><a class="teal-text" href="#!">Datenschutz</a></li>
                            <li><a class="teal-text" href="#!">Impressum</a></li>
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
    import { onMounted } from 'vue';
    import M from 'materialize-css';

    onMounted(() => {
        M.AutoInit();
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
