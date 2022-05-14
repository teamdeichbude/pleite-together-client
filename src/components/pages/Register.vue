<template>
    <article class="container">
        <section class="section">
            <h1>Kasse mit ID: {{ registerId }}</h1>
        </section>
    </article>
</template>

<script setup lang="ts">
    import { computed } from '@vue/reactivity';
    import { useRoute } from 'vue-router';

    const route = useRoute();

    const registerId = computed(() => {
        return route.params.registerId;
    });
</script>
