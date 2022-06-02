<template>
    <div class="member-list-container">
        Gesamtausgaben: {{ totalExpenseSum }}
        <!--    <ul v-if="memberList" class="members collection with-header">
            <li v-for="member in memberList" :key="member.id" class="collection-item">
                <div class="member-row">
                    <span class="expense-title">{{ member.name }}</span>
                    <span v-if="expensesByMemberId" class="title amount"
                        ><i class="material-icons">payment</i> {{ expensesByMemberId[member.id] }} €</span
                    >
                </div>
            </li>
        </ul> -->
    </div>
</template>

<script setup lang="ts">
    import Member from '@/api-types/Member';
    import { getCurrentInstance, onMounted, ref, Ref, toRef } from 'vue';

    const internalInstance = getCurrentInstance();
    const props = defineProps<{ expensesByMemberId: Number[]; memberList: Member[] }>();

    let totalExpenseSum: Ref<Number | undefined> = ref();

    function setTotalExpenseSum() {
        totalExpenseSum.value = 0;
        props.expensesByMemberId.forEach((element) => {
            if (element && totalExpenseSum && totalExpenseSum.value !== undefined) {
                totalExpenseSum.value += element * 100;
            }
        });
    }

    onMounted(() => {
        setTotalExpenseSum();
    });
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
