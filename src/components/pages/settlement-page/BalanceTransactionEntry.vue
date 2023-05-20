<template>
    <div class="balance-transaction-entry">
        <div class="payer-receiver">{{ payer }} -> {{ receiver }}</div>
        <div class="amount">{{ ((-1 * amount) / 100).toFixed(2) }} €</div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{ payer: string; amount: number; receiver: string }>();
</script>

<style scoped lang="scss">
    .balance-transaction-entry {
        display: flex;
        justify-content: space-between;
        .payer-receiver {
            font-weight: 500;
        }
    }
</style>
