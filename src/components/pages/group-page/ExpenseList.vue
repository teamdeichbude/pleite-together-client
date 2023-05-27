<template>
    <div class="expense-list-container">
        <div v-if="expenseList" class="expenses-container">
            <div v-for="expense in expenseList" :key="expense.id">
                <ExpenseCard
                    :amount="expense.amount"
                    :member-name="expense.member_name"
                    :paid-at="expense.expense_paid_at"
                    :expense-title="expense.title"
                    :receiving-member-name="expense.receiving_member_name"
                ></ExpenseCard>
            </div>
        </div>
        <div v-else class="loader">Loading</div>
    </div>
</template>

<script setup lang="ts">
    import Expense from '@/api-types/Expense';
    import { useApiStore } from '@/stores/ApiStore';
    import { onMounted, ref, Ref } from 'vue';
    import ExpenseCard from './ExpenseCard.vue';

    const apiStore = useApiStore();

    const props = defineProps<{ groupInvite: string }>();

    const expenseList: Ref<Expense[] | undefined> = ref();

    onMounted(() => {
        apiStore.fetchExpenses(props.groupInvite, true).then(() => {
            expenseList.value = apiStore.getExpensesSortedByExpenseDate;
        });
    });
</script>

<style scoped lang="scss">
    .expense-list-container {
        @media (min-width: 601px) {
            width: 70%;
            margin: 0 auto;
        }
    }

    .expenses-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>
