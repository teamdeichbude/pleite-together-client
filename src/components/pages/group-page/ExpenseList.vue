<template>
    <div class="container">
        <h2>Hier kommt die Liste</h2>

        <ul v-if="expenseList" class="expenses collection with-header">
            <li class="collection-header"><h4>Ausgaben</h4></li>
            <li v-for="expense in expenseList" :key="expense.id" class="collection-item avatar">
                <img src="https://via.placeholder.com/44x44" alt="" class="circle" />
                <span class="title">{{ expense.title }}</span>
                <p class="payer">{{ displayDate(expense.expense_paid_at) }} by {{ expense.member_name }}</p>
                <span class="secondary-content"><i class="material-icons">payment</i>{{ expense.amount }}€</span>
            </li>
        </ul>
        <div v-else class="loader">Loading</div>
    </div>
</template>

<script setup lang="ts">
    import Expense from '@/api-types/Expense';
    import { getCurrentInstance, onMounted, ref, Ref } from 'vue';

    const internalInstance = getCurrentInstance();
    const props = defineProps<{ groupInvite: string }>();

    const expenseList: Ref<Expense[] | undefined> = ref();

    function displayDate(date: string) {
        return internalInstance?.appContext.config.globalProperties.$moment(date).calendar();
    }

    function laterExpenseDate(a, b) {
        if (a.expense_paid_at < b.expense_paid_at) {
            return 1;
        }
        if (a.expense_paid_at > b.expense_paid_at) {
            return -1;
        }
        return 0;
    }

    function fetchExpenses() {
        fetch(`http://localhost:3001/groups/${props.groupInvite}/expenses`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                const expenses = data.sort(laterExpenseDate);
                console.log(expenses);
                expenseList.value = expenses;
            });
    }

    onMounted(() => {
        fetchExpenses();
    });
</script>

<style scoped lang="scss">
    .expenses.collection .collection-item {
        &.avatar {
            .title {
                font-size: 1.4rem;
                font-weight: 600;
            }
            .secondary-content {
                display: flex;
                gap: 4px;
                min-width: 120px;
                justify-content: space-between;
                font-family: 'Courier New', Courier, monospace;
                font-size: larger;
                font-weight: 600;
            }
            .payer {
                &::before {
                    //content: ' – ';
                }
            }
        }
    }
</style>
