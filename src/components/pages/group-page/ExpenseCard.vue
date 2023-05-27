<template>
    <div class="expense card">
        <div class="title-row">
            <div class="expense-title">{{ expenseTitle }}</div>
            <div>
                <span class="amount"> {{ formatToEur((amount / 100) * -1) }} </span>
            </div>
        </div>

        <div>
            <div class="payer">
                <i class="tiny material-icons">person_outline</i> {{ memberName }}
                <template v-if="receivingMemberName">
                    <i class="tiny material-icons">keyboard_arrow_right</i>
                    <i class="tiny material-icons">person</i>
                    {{ receivingMemberName }}
                </template>
            </div>
            <div class="time"><i class="tiny material-icons">today</i> {{ displayDate(paidAt) }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { getCurrentInstance } from 'vue';
    import formatToEur from '@/helpers/currencyFormatter';

    const internalInstance = getCurrentInstance();

    const props = defineProps<{
        expenseTitle: string;
        paidAt: string;
        memberName: string;
        amount: number;
        receivingMemberName?: string;
    }>();

    function displayDate(date: string) {
        return internalInstance?.appContext.config.globalProperties.$moment(date).calendar();
    }
</script>

<style scoped lang="scss">
    .expense.card {
        display: flex;
        flex-direction: column;
        .title-row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding-bottom: 0.5rem;
        }

        .payer {
            font-size: 0.9rem;
        }
        .payer,
        .time {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: 0.4rem;
        }
    }

    .tiny {
        font-size: 1rem;
    }
    .amount {
        display: flex;
        justify-content: flex-end;
        gap: 4px;
        min-width: 120px;
        font-size: large;
    }
    .expense-title {
        flex-basis: 100%;
        font-weight: 500;
        @media (min-width: 600px) {
            order: 1;
            flex-basis: 70%;
        }
    }
    .time {
        font-size: 0.8rem;
        color: grey;
        flex-basis: 100%;

        @media (min-width: 600px) {
            order: 3;
        }
    }
</style>
