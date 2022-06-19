<template>
    <div class="member-list-container">
        <h2>Beteiligte</h2>
        <div v-if="loading">Loading ...</div>
        <div v-else>
            <ul class="members collection with-header">
                <!--<li class="collection-header"><h4>Ausgaben</h4></li>-->
                <li v-for="member in memberList" :key="member.id" class="collection-item">
                    <div class="member-row">
                        <span class="expense-title">{{ member.name }}</span>
                        <span v-if="expensesByMemberId" class="title amount"
                            ><i class="material-icons">payment</i> {{ expensesByMemberId[member.id] }} €</span
                        >
                    </div>
                </li>
            </ul>

            <h2>Offene Ausgleichszahlungen</h2>
            <p>Gesamtausgaben: {{ totalExpenseSum }} €</p>
            <p>Anzahl Beteiligte: {{ memberCount }}</p>
            <p>Betrag pro Person: {{ amountPerPerson }}</p>

            <h3>Wer schuldet wem was?</h3>
            <ul>
                <li v-for="action in balanceTransactions" :key="action.key">
                    {{ memberList[action.payerId]?.name }} gibt {{ ((-1 * action.amount) / 100).toFixed(2) }} € an
                    {{ memberList[action.getterId]?.name }}
                </li>
            </ul>
        </div>

        <!-- <compensation-overview
            v-if="expensesByMemberId && memberList"
            :expenses-by-member-id="expensesByMemberId"
            :member-list="memberList"
        ></compensation-overview> -->
    </div>
</template>

<script setup lang="ts">
    import Member from '@/api-types/Member';
    import { computed, onMounted, ref, Ref } from 'vue';
    import BalanceTransaction from './BalanceTransaction';
    import { useApiStore } from '@/stores/ApiStore';

    type ExpenseByMemberRecord = { [memberId: number]: number };

    const apiStore = useApiStore();
    let loading: Ref<boolean> = ref(true);

    const props = defineProps<{ groupInvite: string }>();

    const memberList: Ref<{ [key: string]: Member }> = ref({});
    let expensesByMemberId: Ref<ExpenseByMemberRecord | undefined> = ref();

    onMounted(async () => {
        expensesByMemberId.value = [];
        memberList.value = await apiStore.fetchMembers(props.groupInvite);

        const expenseListResult = await apiStore.fetchExpenses(props.groupInvite);
        const expenseSumPerMemberId = {};
        expenseListResult.forEach((expense) => {
            if (expenseSumPerMemberId[expense.member_id] === undefined) {
                expenseSumPerMemberId[expense.member_id] = 0;
            }

            expenseSumPerMemberId[expense.member_id] += expense.amount;
        });

        // not exactly sure why we don't have to divide by 100 here anymore but alright ...
        // for (const memberId in expenseSumPerMemberId) {
        //     expenseSumPerMemberId[memberId] = expenseSumPerMemberId[memberId] / 100;
        // }

        for (let key in memberList.value) {
            const member = memberList.value[key];
            if (expenseSumPerMemberId[member.id] === undefined) {
                expenseSumPerMemberId[member.id] = 0;
            }
        }

        expensesByMemberId.value = expenseSumPerMemberId;

        setTotalExpenseSum();
        setWhoGetsOrPaysHowMuch();
        balanceAll();
        loading.value = false;
    });

    // stuff below here is for the compensation overview
    let totalExpenseSum: Ref<number | undefined> = ref();
    let whoGetsHowMuch: Ref<number[]> = ref([]);
    let balanceTransactions: Ref<BalanceTransaction[] | undefined> = ref();

    const memberCount: Ref<number> = computed(() => {
        return Object.keys(memberList.value).length;
    });

    const amountPerPerson: Ref<number> = computed(() => {
        if (totalExpenseSum.value) {
            return Number.parseFloat((totalExpenseSum.value / memberCount.value).toFixed(2));
        }
        return 0;
    });

    function setTotalExpenseSum() {
        totalExpenseSum.value = 0;
        for (const memberId in expensesByMemberId.value) {
            if (expensesByMemberId.value[memberId] && totalExpenseSum && totalExpenseSum.value !== undefined) {
                totalExpenseSum.value += expensesByMemberId.value[memberId] * 100;
            }
        }
        totalExpenseSum.value = totalExpenseSum.value / 100;
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

        whileLoop: while (unbalanced && currentLoop < 200) {
            unbalanced = false;
            modelExpensesByMemberId = { ...expensesByMemberId.value };
            for (let key in modelExpensesByMemberId) {
                modelExpensesByMemberId[key] = Number(modelExpensesByMemberId[key].toFixed(2)) * 100;
            }

            modelWhoGetsHowMuch = { ...whoGetsHowMuch.value };
            for (let key in modelWhoGetsHowMuch) {
                modelWhoGetsHowMuch[key] = Number(modelWhoGetsHowMuch[key].toFixed(2)) * 100;
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
    .member-list-container {
        @media (min-width: 601px) {
            width: 70%;
            margin: 0 auto;
        }
    }
    .members.collection .collection-item {
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
                font-family: 'Courier New', Courier, monospace;
                font-size: larger;
                font-weight: 600;
                margin: 1rem 0;
                justify-content: flex-end;
            }
            .expense-title {
                font-size: larger;
                flex-basis: 50%;
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
