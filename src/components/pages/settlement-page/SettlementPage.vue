<template>
    <div class="member-list-container">
        <div v-if="loading">Loading ...</div>
        <div v-else>
            <div class="figures card expense-overview">
                <div class="figure expense small">
                    <div class="number">{{ formatToEur(totalExpenses / 100) }}</div>
                    <div class="label">Ausgaben</div>
                </div>
                <div class="figure gain small">
                    <div class="number">{{ formatToEur(totalGains / 100) }}</div>
                    <div class="label">Einnahmen</div>
                </div>
                <hr />
                <div class="figure">
                    <div class="number">{{ formatToEur((totalExpenseSum / 100) * -1) }}</div>
                    <div class="label">Gesamt</div>
                </div>
            </div>

            <h2>Offene Ausgleichszahlungen</h2>
            <div class="figures card">
                <div class="figure">
                    <div class="number">{{ memberCount }}</div>
                    <div class="label">Personen</div>
                </div>
                <hr class="vertical" />
                <div class="figure">
                    <div class="number">{{ formatToEur(amountPerPerson / 100) }}</div>
                    <div class="label">Betrag pro Person</div>
                </div>
            </div>
            <div class="card balance-transactions">
                <template v-for="action in balanceTransactions" :key="action.key">
                    <balance-transaction-entry
                        :payer="memberList[action.payerId]?.name"
                        :amount="action.amount"
                        :receiver="memberList[action.getterId]?.name"
                    >
                    </balance-transaction-entry>
                    <hr />
                </template>
                <template v-if="balanceTransactions === undefined || balanceTransactions.length === 0">
                    Alles ausgeglichen! :)
                </template>
            </div>

            <h2>Beträge pro Person</h2>
            <div class="card member-list">
                <template v-for="member in memberList" :key="member.id">
                    <div class="member-row">
                        <span class="expense-title">{{ member.name }}</span>
                        <span v-if="expensesByMemberId" class="amount">
                            {{
                                formatToEur(
                                    expensesByMemberId[member.id] !== 0
                                        ? (expensesByMemberId[member.id] / 100) * -1
                                        : expensesByMemberId[member.id] / 100
                                )
                            }}
                        </span>
                    </div>
                    <hr />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Member from '@/api-types/Member';
    import { computed, onMounted, ref, Ref } from 'vue';
    import BalanceTransaction from './BalanceTransaction';
    import { useApiStore } from '@/stores/ApiStore';
    import BalanceTransactionEntry from './BalanceTransactionEntry.vue';
    import { useRouter } from 'vue-router';
    import formatToEur from '@/helpers/currencyFormatter';

    type ExpenseByMemberRecord = { [memberId: number]: number };

    const router = useRouter();

    const apiStore = useApiStore();
    let loading: Ref<boolean> = ref(true);

    const props = defineProps<{ groupCode: string }>();

    const memberList: Ref<{ [key: string]: Member }> = ref({});
    let expensesByMemberId: Ref<ExpenseByMemberRecord | undefined> = ref();

    const totalExpenseSum: Ref<number> = ref(0);
    const totalExpenses: Ref<number> = ref(0);
    const totalGains: Ref<number> = ref(0);

    onMounted(async () => {
        expensesByMemberId.value = [];
        memberList.value = await apiStore.fetchMembers(props.groupCode, true).catch((error) => {
            router.push('404');
            return {};
        });

        const expenseSumPerMemberId = {};
        for (let key in memberList.value) {
            const member = memberList.value[key];
            expenseSumPerMemberId[member.id] = 0;
        }
        const expenseListResult = await apiStore.fetchExpenses(props.groupCode, true).catch((err) => {
            return [];
        });
        expenseListResult.forEach((expense) => {
            if (expense.receiving_member_id === undefined && expense.amount > 0) {
                totalExpenses.value -= expense.amount;
            } else if (expense.receiving_member_id === undefined) {
                totalGains.value -= expense.amount;
            }

            expenseSumPerMemberId[expense.member_id] += expense.amount;
            // Linked transactions are only returned once
            // -> Need to manually add a second entry for the receiver
            if (expense.receiving_member_id) {
                expenseSumPerMemberId[expense.receiving_member_id] -= expense.amount;
            }
        });

        expensesByMemberId.value = expenseSumPerMemberId;

        setTotalExpenseSum();
        setWhoGetsOrPaysHowMuch();
        balanceAll();
        loading.value = false;
    });

    // stuff below here is for the compensation overview
    let whoGetsHowMuch: Ref<number[]> = ref([]);
    let balanceTransactions: Ref<BalanceTransaction[] | undefined> = ref();

    const memberCount: Ref<number> = computed(() => {
        return Object.keys(memberList.value).length;
    });

    const amountPerPerson: Ref<number> = computed(() => {
        if (totalExpenseSum.value) {
            return Number.parseFloat((totalExpenseSum.value / memberCount.value).toFixed(0));
        }
        return 0;
    });

    function setTotalExpenseSum() {
        totalExpenseSum.value = 0;
        for (const memberId in expensesByMemberId.value) {
            if (expensesByMemberId.value[memberId] && totalExpenseSum && totalExpenseSum.value !== undefined) {
                totalExpenseSum.value += expensesByMemberId.value[memberId];
            }
        }
    }

    function setWhoGetsOrPaysHowMuch() {
        for (const memberId in expensesByMemberId.value) {
            let gettingAmount = expensesByMemberId.value[memberId] - amountPerPerson.value;
            whoGetsHowMuch.value[memberId] = gettingAmount;
        }
    }

    function balanceAll() {
        // Possible optimization: use an array of objects for modelWhoGetsHowMuch
        // to be able to sort from high to low, might result in better balanceActions

        let modelExpensesByMemberId;
        let modelWhoGetsHowMuch;
        let unbalanced = true;
        let currentLoop = 1;
        let balanceActions: BalanceTransaction[] = [];

        whileLoop: while (unbalanced && currentLoop < 5000) {
            unbalanced = false;
            modelExpensesByMemberId = { ...expensesByMemberId.value };
            for (let key in modelExpensesByMemberId) {
                modelExpensesByMemberId[key] = Number(modelExpensesByMemberId[key].toFixed(2));
            }

            modelWhoGetsHowMuch = { ...whoGetsHowMuch.value };
            for (let key in modelWhoGetsHowMuch) {
                modelWhoGetsHowMuch[key] = Number(modelWhoGetsHowMuch[key].toFixed(2));
            }

            balanceActions.forEach((action) => {
                modelExpensesByMemberId[action.payerId] -= action.amount;
                modelExpensesByMemberId[action.getterId] += action.amount;
                modelWhoGetsHowMuch[action.payerId] -= action.amount;
                modelWhoGetsHowMuch[action.getterId] += action.amount;
            });

            for (let memberId in modelWhoGetsHowMuch) {
                const amount: Number = modelWhoGetsHowMuch[memberId];
                // okay, not perfect yet, at the moment we need to allow rounding errors of 1 Cent :(
                if (amount !== undefined && amount !== null && amount > 1) {
                    unbalanced = true;
                    let closestMatchMemberId = 0;

                    for (const possiblePayerMemberId in modelWhoGetsHowMuch) {
                        const possiblePayerIdNumber = Number.parseInt(possiblePayerMemberId);
                        if (memberId == possiblePayerMemberId) {
                            continue;
                        }
                        const amount2 = modelWhoGetsHowMuch[possiblePayerIdNumber];
                        if (
                            amount2 < 0 &&
                            amount + amount2 > 0 &&
                            (closestMatchMemberId === 0 ||
                                amount + amount2 < amount + modelWhoGetsHowMuch[closestMatchMemberId])
                        ) {
                            closestMatchMemberId = possiblePayerIdNumber;
                        }
                    }

                    // We found someone who can give all their debts to the current person.
                    // Add this transaction to the Actions list.
                    if (closestMatchMemberId > 0) {
                        balanceActions.push({
                            key: currentLoop,
                            payerId: closestMatchMemberId,
                            getterId: Number.parseInt(memberId),
                            amount: modelWhoGetsHowMuch[closestMatchMemberId],
                        });
                        currentLoop++;
                        continue whileLoop;
                    }

                    // We couldn't find anyone who can give all their debts to the current person.
                    // Meaning, this person gets less money than anyone owes.
                    // Someone will have to give part of their debts to one person and part to someone else

                    // Let's see if there is anyone who owes enough money, so we only get money from one person
                    if (closestMatchMemberId === 0) {
                        for (const possiblePayerMemberId in modelWhoGetsHowMuch) {
                            const payerGetAmount = modelWhoGetsHowMuch[Number.parseInt(possiblePayerMemberId)];
                            // look for someone who owes enough money
                            if (
                                memberId !== possiblePayerMemberId &&
                                payerGetAmount + modelWhoGetsHowMuch[memberId] < 0
                            ) {
                                closestMatchMemberId = Number.parseInt(possiblePayerMemberId);
                                balanceActions.push({
                                    key: currentLoop,
                                    payerId: closestMatchMemberId,
                                    getterId: Number.parseInt(memberId),
                                    amount: modelWhoGetsHowMuch[memberId] * -1,
                                });
                                currentLoop++;
                                continue whileLoop;
                            }
                        }
                    }

                    // If closestMatchMemberId is still 0, that means there is nobody who
                    // owes at least the amount we still get.
                    // That means we will need to take money from multiple people.
                    // Let's find the first, add them to the actions list and continue,
                    // so we will find the next in the following while loop execution.

                    if (closestMatchMemberId === 0) {
                        for (const possiblePayerMemberId in modelWhoGetsHowMuch) {
                            const payerGetAmount = modelWhoGetsHowMuch[Number.parseInt(possiblePayerMemberId)];
                            // look for anyone who owes any money
                            if (memberId !== possiblePayerMemberId && payerGetAmount < 0) {
                                if (payerGetAmount + modelWhoGetsHowMuch[memberId] > 0) {
                                    //should never happen
                                    console.warn('We missed something... ');
                                    console.warn(
                                        'Trying to find any payer for member ' +
                                            memberId +
                                            'who is waiting for ' +
                                            modelWhoGetsHowMuch[memberId] +
                                            ' EUR.'
                                    );
                                    console.warn(
                                        'Tried with member ' +
                                            possiblePayerMemberId +
                                            ' who still owes ' +
                                            payerGetAmount +
                                            ' EUR.'
                                    );
                                    continue;
                                } else {
                                    closestMatchMemberId = Number.parseInt(possiblePayerMemberId);
                                    balanceActions.push({
                                        key: currentLoop,
                                        payerId: closestMatchMemberId,
                                        getterId: Number.parseInt(memberId),
                                        amount: modelWhoGetsHowMuch[closestMatchMemberId],
                                    });
                                    currentLoop++;
                                    continue whileLoop;
                                }
                            }
                        }
                    }
                }
            }
            currentLoop++;
        }

        // we have our finished balanceActions. Yaaay!
        balanceTransactions.value = balanceActions;
    }
</script>

<style scoped lang="scss">
    h2,
    h3 {
        color: $font-light;
    }

    .figures {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;

        .figure {
            color: $black-light;
            display: flex;
            flex-direction: column;
            align-items: center;
            .number {
                font-size: larger;
            }

            &.small {
                font-size: small;
                .number {
                    font-size: medium;
                }
            }

            &.expense {
                color: $red;
            }
            &.gain {
                color: $green;
            }
        }
    }

    .expense-overview {
        flex-direction: column;
        gap: 0.5rem;
        .figure {
            flex-direction: row;
            justify-content: space-between;

            .number {
                order: 2;
            }
        }
    }

    .balance-transactions,
    .member-list {
        gap: 0.5rem;

        hr {
            width: 100%;
            opacity: 0.3;
            &:last-child {
                display: none;
            }
        }
    }
    .member-list-container {
        @media (min-width: 601px) {
            width: 70%;
            margin: 0 auto;
        }
    }
    .member-list {
        .member-row {
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
                justify-content: flex-end;
            }
            .expense-title {
                flex-basis: 50%;
                font-weight: 500;
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
