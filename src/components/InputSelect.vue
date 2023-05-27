<template>
    <div class="input-wrapper">
        <label v-if="label" :for="id">{{ label }}</label>
        <div class="input-field">
            <select
                :id="id"
                :value="modelValue"
                class="browser-default"
                :required="required"
                @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
            >
                <option disabled value="">{{ placeholder }}</option>
                <option v-for="option in availableOptions" :key="option.key" :value="option.key">
                    {{ option.value }}
                </option>
            </select>
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
        modelValue;
        availableOptions: Record<string, { key: string; value: string }>;
        placeholder: string;
        required?: boolean;
        errorMessage?: string;
    }>();

    defineEmits(['update:modelValue']);
</script>

<style scoped lang="scss">
    .input-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .input-field {
        width: 100%;

        display: grid;
        grid-template-areas: 'select';
        align-items: center;
        select {
            -webkit-appearance: none;
            background-color: $bg-color-light;
            width: 100%;
            padding-right: 1rem;
            grid-area: select;
        }
        &::after {
            content: '';
            width: 0.8em;
            height: 0.5em;
            background-color: $black-lighter;
            clip-path: polygon(100% 0%, 0 0%, 50% 100%);
            grid-area: select;
            justify-self: end;
            transform: translateX(-1rem);
        }
    }
</style>
