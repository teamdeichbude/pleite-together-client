<template>
    <div class="expense-list-container">
        <h2>Ausgaben</h2>

        <ul v-if="expenseList" class="expenses collection with-header">
            <!--<li class="collection-header"><h4>Ausgaben</h4></li>-->
            <li v-for="expense in expenseList" :key="expense.id" class="collection-item">
                <div class="expense-row">
                    <span class="title amount"><i class="material-icons">payment</i>{{ expense.amount }}€</span>
                    <span class="expense-title">{{ expense.title }}</span>
                    <p class="payer">
                        {{ displayDate(expense.expense_paid_at) }} by
                        <span class="name">{{ expense.member_name }}</span>
                    </p>
                </div>
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
            .then((data) => (expenseList.value = data.sort(laterExpenseDate)));
    }

    onMounted(() => {
        fetchExpenses();
    });
</script>

<style scoped lang="scss">
    .expense-list-container {
        @media (min-width: 601px) {
            width: 70%;
            margin: 0 auto;
        }
    }
    .expenses.collection .collection-item {
        .expense-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;

            .title {
                font-size: 1.4rem;
                font-weight: 600;
                @media (min-width: 600px) {
                    order: 2;
                }
            }
            .amount {
                display: flex;
                gap: 4px;
                min-width: 120px;
                font-family: 'Courier New', Courier, monospace;
                font-size: larger;
                font-weight: 600;
                margin: 1rem 0;
            }
            .expense-title {
                font-size: larger;
                flex-basis: 100%;
                font-weight: 600;
                @media (min-width: 600px) {
                    order: 1;
                    flex-basis: 70%;
                }
            }
            .payer {
                text-transform: uppercase;
                font-size: small;
                color: grey;
                flex-basis: 100%;

                @media (min-width: 600px) {
                    order: 3;
                }
            }
        }
    }
</style>
