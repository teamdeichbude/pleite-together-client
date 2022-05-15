<template>
    <article class="container">
        <section class="section">
            <h1>hi</h1>
            <div class="row create-register">
                <button class="waves-effect waves-light btn disabled">
                    <i class="material-icons left">create_new_folder</i>Neue Gruppe erstellen
                </button>
            </div>
        </section>
        <div class="divider"></div>
        <join-register></join-register>
        <div class="divider"></div>
        <section class="section">
            <div class="row">
                <h5>Zuletzt auf diesem Gerät besuchte Gruppen</h5>

                <div class="container col s12">
                    <ul class="collection">
                        <li class="collection-item avatar">
                            <i class="material-icons circle teal">play_arrow</i>
                            <span class="title">Title</span>
                            <p>
                                Gruppenname <br />
                                Non nisi aliquip aute labore velit esse Lorem dolore.
                            </p>
                            <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
                        </li>
                        <li class="collection-item avatar">
                            <i class="material-icons circle teal">play_arrow</i>
                            <span class="title">Title</span>
                            <p>
                                Gruppenname <br />
                                Non nisi aliquip aute labore velit esse Lorem dolore.
                            </p>
                            <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
                        </li>
                        <li class="collection-item avatar">
                            <i class="material-icons circle teal">play_arrow</i>
                            <span class="title">Title</span>
                            <p>
                                Gruppenname <br />
                                Non nisi aliquip aute labore velit esse Lorem dolore.
                            </p>
                            <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
                        </li>
                        <li class="collection-item avatar">
                            <i class="material-icons circle teal">play_arrow</i>
                            <span class="title">Title</span>
                            <p>
                                Gruppenname <br />
                                Non nisi aliquip aute labore velit esse Lorem dolore.
                            </p>
                            <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </article>
</template>

<script setup lang="ts">
    import JoinRegister from './JoinRegister.vue';
</script>
