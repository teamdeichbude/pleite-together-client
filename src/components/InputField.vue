<template>
    <div class="input-wrapper" :suffix="suffix ? suffix : ''">
        <label v-if="label" :for="id">{{ label }}</label>
        <div class="input-field">
            <input
                :id="id"
                :value="modelValue"
                :class="[{ error: errorMessage }, 'validate']"
                :placeholder="placeholder"
                :pattern="pattern"
                :maxlength="maxLength"
                :required="required"
                :title="title"
                :type="inputType ? inputType : 'text'"
                @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
                @keypress="onKeypress"
            />
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
        required?: boolean;
        maxLength?: number;
        placeholder?: string;
        pattern?: string;
        errorMessage?: string;
        title?: string;
        onKeypress?;
        inputType?: string;
        suffix?: string;
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
        display: flex;
        position: relative;

        input {
            width: 100%;
        }
        &::after {
            content: attr(suffix);
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
        }
    }
</style>
