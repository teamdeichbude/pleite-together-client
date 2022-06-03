<template>
    <section class="section">
        <div class="row">
            <div class="input-field col s12 l6">
                <input
                    id="access-code"
                    v-model="accessCode"
                    :class="[{ invalid: errorMessage }, 'validate']"
                    type="text"
                    @keypress="onKeypress"
                />
                <label for="access-code">Accesscode</label>
                <span class="helper-text" :data-error="errorMessage">Gib deinen Zugangscode ein</span>
            </div>
            <div class="input-field col s12 l6">
                <button
                    ref="submitCodeLink"
                    :disabled="accessCode === ''"
                    class="btn waves-effect waves-light"
                    @click.stop="accessGroup"
                >
                    <i class="material-icons left">subdirectory_arrow_right</i>Einer Gruppe beitreten
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { access } from 'fs';
    import { Ref, ref } from 'vue';
    import { routerKey, useRouter } from 'vue-router';

    const router = useRouter();
    const accessCode = ref('');
    const errorMessage = ref('');

    const submitCodeLink: Ref<undefined | any> = ref();

    function accessGroup() {
        errorMessage.value = '';

        fetch(`${import.meta.env.VITE_API_HOST}/groups/${accessCode.value}/`).then((response) => {
            if (response.status > 400) {
                errorMessage.value = 'Zu diesem Code wurde keine Gruppe gefunden. Tippfehler?';
                return false;
            } else {
                router.push(`/gruppe-${accessCode.value}`);
            }
        });
    }

    function onKeypress(e: KeyboardEvent) {
        if (e.key === 'Enter' && accessCode.value !== '') {
            accessGroup();
        }
    }
</script>
