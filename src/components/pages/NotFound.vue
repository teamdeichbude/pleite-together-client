<template>
    <div>
        <h2>Das was du suchst, gibt es hier nicht.</h2>
        <router-link :to="'/'">-> Zurück zur Startseite</router-link>
    </div>
</template>

<script setup lang="ts">
    import { RouterLink } from 'vue-router';
</script>

<style scoped lang="scss">
    * {
        color: $font-light;
    }

    a {
        text-decoration: underline;
    }
</style>
