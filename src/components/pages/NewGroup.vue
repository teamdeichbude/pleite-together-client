<template>
    <article class="container">
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
                    <label for="access-code">6 stelliger Zugangscode</label>
                    <span class="helper-text" :data-error="errorMessage"
                        >Gib den 6-stelligen Zugangscode für deine Gruppe ein</span
                    >
                </div>
                <div class="input-field col s12 l6">
                    <button
                        ref="submitCodeLink"
                        :disabled="accessCode === ''"
                        class="btn waves-effect waves-light"
                        @click.stop="createGroup"
                    >
                        <i class="material-icons left">subdirectory_arrow_right</i>Gruppe erstellen
                    </button>
                </div>
            </div>
        </section>
    </article>
</template>

<script setup lang="ts">
    import { access } from 'fs';
    import { Ref, ref } from 'vue';
    import { routerKey, useRouter } from 'vue-router';

    const router = useRouter();
    const accessCode = ref('');
    const errorMessage = ref('');

    const submitCodeLink: Ref<undefined | any> = ref();

    function createGroup() {
        errorMessage.value = '';
        if (accessCode.value.length !== 6) {
            errorMessage.value = 'Der Zugangscode muss genau  6 Zeichen lang sein';
            return;
        }

        const requestBody = { code: accessCode.value };
        fetch(`${import.meta.env.VITE_API_HOST}/groups/`, {
            method: 'POST',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                console.log(response);
                if (response.status === 201) {
                    router.push(`/gruppe-${accessCode.value}`);
                } else {
                    errorMessage.value =
                        'Die Gruppe konnte nicht erstellt werden. Bitte probiere einen anderen Zugangscode.';
                }
            })
            .catch((error) => {
                console.log(error);
                errorMessage.value =
                    'Die Gruppe konnte nicht erstellt werden. Bitte probiere einen anderen Zugangscode.';
            });
    }

    function onKeypress(e: KeyboardEvent) {
        if (e.key === 'Enter' && accessCode.value !== '') {
            createGroup();
        }
    }
</script>
