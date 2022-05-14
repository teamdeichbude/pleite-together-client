<template>
    <section class="section">
        <div class="row">
            <div class="input-field col s6">
                <input id="access-code" type="text" v-model="accessCode" class="validate" />
                <label for="access-code">Accesscode</label>
                <span class="helper-text" data-error="wrong" data-success="right">Gib deinen Zugangscode ein</span>
            </div>
            <div class="input-field col s6">
                <router-link :to="`/kasse-${accessCode}`" class="waves-effect waves-light btn">
                    <i class="material-icons left">subdirectory_arrow_right</i>Einer Kasse beitreten
                </router-link>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    const accessCode = ref('');
</script>
