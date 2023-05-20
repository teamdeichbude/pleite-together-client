<template>
    <div class="input-wrapper">
        <div class="checkbox">
            <label :for="id">
                <input
                    :id="id"
                    :value="modelValue"
                    :class="[{ error: errorMessage, checked: modelValue }, 'validate']"
                    type="checkbox"
                    @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
                />
                {{ label }}
            </label>
        </div>
        <span
            v-if="errorMessage"
            :class="[{ error: errorMessage }, 'helper-text']"
            :data-error="errorMessage"
            v-html="errorMessage"
        ></span>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        id: string;
        label: string;
        modelValue: boolean;
        errorMessage?: string;
    }>();

    const emit = defineEmits(['update:modelValue']);
</script>

<style scoped lang="scss">
    /** https://moderncss.dev/pure-css-custom-checkbox-style/ */
    .input-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;

        label {
            display: grid;
            grid-template-columns: 1.15rem auto;
            gap: 0.5rem;
            font-size: 1.05rem;
            line-height: 1.5rem;
        }

        input[type='checkbox'] {
            /* Add if not using autoprefixer */
            -webkit-appearance: none;
            appearance: none;
            /* For iOS < 15 to remove gradient background */
            background-color: #fff;
            /* Not removed via appearance */
            margin: 0;

            width: 1.15rem;
            height: 1.15rem;
            padding: 0;
            border: 0.15rem solid $primary-color;
            border-radius: 0.15rem;
            transform: translateY(0.2rem);

            display: grid;
            place-content: center;

            &.checked {
                background-color: $primary-color;
            }

            &::before {
                content: '';
                width: 0.65em;
                height: 0.65em;
                transform: scale(0);
                transition: 120ms transform ease-in-out;
                box-shadow: inset 1em 1em var(--form-control-color);
                background-color: $bg-color-light;
                clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
            }
        }

        input[type='checkbox'].checked::before {
            transform: scale(1);
        }
    }
</style>
