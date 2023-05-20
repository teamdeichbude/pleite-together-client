<template>
    <div class="">
        <button class="new-entry" @click="modalOpen = true">
            <i class="large material-icons">add</i> Neuer Eintrag
        </button>
        <new-expense-modal
            :group-code="groupCode"
            :open="modalOpen"
            @close-modal="modalOpen = false"
        ></new-expense-modal>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import NewExpenseModal from './NewExpenseModal.vue';

    const props = defineProps<{ groupCode: string }>();

    const modalOpen = ref(false);
</script>

<style scoped lang="scss">
    button {
        width: 100%;
        margin-bottom: 1rem;
        background-color: rgba(255, 255, 255, 0.25) !important;
        color: white;
        // https://kovart.github.io/dashed-border-generator/
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23FFFFFFB3' stroke-width='4' stroke-dasharray='4%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem 1rem;
    }
</style>
