<template>
    <section class="card gap-s">
        <input-field
            id="access-code"
            label="Accesscode"
            :error-message="errorMessage"
            :model-value="accessCode"
            :on-keypress="onKeypress"
            @update:model-value="(newValue) => (accessCode = newValue)"
        ></input-field>

        <button ref="submitCodeLink" :disabled="accessCode === ''" class="" @click.stop="accessGroup">
            Zur Gruppe
        </button>
    </section>
</template>

<script setup lang="ts">
    import InputField from '@/components/InputField.vue';
    import { useApiStore } from '@/stores/ApiStore';
    import { Ref, ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const accessCode = ref('');
    const errorMessage = ref('');

    const submitCodeLink: Ref<undefined | any> = ref();

    function accessGroup() {
        errorMessage.value = '';

        useApiStore()
            .fetchGroup(accessCode.value)
            .then(() => {
                router.push(`/gruppe-${accessCode.value}`);
            })
            .catch((reason) => {
                errorMessage.value = 'Zu diesem Code wurde keine Gruppe gefunden. Tippfehler?';

                if (reason instanceof TypeError) {
                    errorMessage.value =
                        'Oh je..' +
                        ' Es gibt Probleme bei der Verbindung mit der Datenbank :(' +
                        ' Sorry.<br><a href="mailto:kontakt@mariasoliman.de"> -> Sag Maria Bescheid</a>';
                }
            });
    }

    function onKeypress(e: KeyboardEvent) {
        if (e.key === 'Enter' && accessCode.value !== '') {
            accessGroup();
        }
    }
</script>

<style scoped lang="scss">
    .card div {
        display: flex;
        flex-direction: column;
    }

    .error {
        &::v-deep(a) {
            color: $error-color;
            text-decoration: underline;
        }
    }
</style>
