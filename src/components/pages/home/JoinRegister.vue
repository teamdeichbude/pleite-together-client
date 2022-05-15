<template>
    <section class="section">
        <div class="row">
            <div class="input-field col s6">
                <input id="access-code" v-model="accessCode" type="text" class="validate" @keypress="onKeypress" />
                <label for="access-code">Accesscode</label>
                <span class="helper-text">Gib deinen Zugangscode ein</span>
            </div>
            <div class="input-field col s6">
                <router-link
                    ref="submitCodeLink"
                    type="submit"
                    :to="`/gruppe-${accessCode}`"
                    class="waves-effect waves-light btn"
                >
                    <i class="material-icons left">subdirectory_arrow_right</i>Einer Gruppe beitreten
                </router-link>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { Ref, ref } from 'vue';
    import { routerKey, useRouter } from 'vue-router';

    const router = useRouter();
    const accessCode = ref('');

    const submitCodeLink: Ref<undefined | any> = ref();

    function onKeypress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            if (submitCodeLink.value) {
                console.log(submitCodeLink.value);
                router.push(submitCodeLink.value.to);
            }
        }
    }
</script>
