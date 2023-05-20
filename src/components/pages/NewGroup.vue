<template>
    <article class="full-width">
        <h1>Neue Gruppe erstellen</h1>
        <div class="card gap-s">
            <input-field
                id="group-code"
                label="6 stelliger Zugangscode"
                :on-keypress="onKeypress"
                :model-value="accessCode"
                :error-message="errorMessage"
                @update:model-value="(newValue) => (accessCode = newValue)"
            ></input-field>

            <button
                ref="submitCodeLink"
                :disabled="accessCode === ''"
                class="btn waves-effect waves-light"
                @click.stop="createGroup"
            >
                Gruppe erstellen
            </button>
        </div>

        <div class="card-link">
            <router-link :to="'/'">Zurück zu Gruppe beitreten</router-link>
        </div>
    </article>
</template>

<script setup lang="ts">
    import { Ref, ref } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';
    import InputField from '../InputField.vue';

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

<style scoped lang="scss">
    h1 {
        text-align: center;
        color: $font-light;
    }
    .card-link {
        margin-top: 1rem;
        text-align: center;
        a {
            color: $font-light;
        }
    }
</style>
