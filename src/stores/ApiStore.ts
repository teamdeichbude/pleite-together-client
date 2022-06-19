import { defineStore } from 'pinia';
import Member from '@/api-types/Member';
import Expense from '@/api-types/Expense';

export type MemberRecord = { [memberId: string]: Member };

export const useApiStore = defineStore('api', {
    state: () => ({
        memberList: undefined as MemberRecord | undefined,
        expenseList: undefined as Expense[] | undefined,
    }),
    getters: {
        getExpensesSortedByExpenseDate(): Expense[] | undefined {
            return this.expenseList?.sort(laterExpenseDate);
        },
    },
    actions: {
        async fetchMembers(groupCode: string, forceFetch?: boolean): Promise<MemberRecord> {
            //todo add reject (e.g. group doesn't exist)
            return new Promise<MemberRecord>((resolve) => {
                if (this.memberList === undefined || forceFetch) {
                    fetch(`${import.meta.env.VITE_API_HOST}/groups/${groupCode}/members`)
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            this.memberList = {};

                            data.forEach((element) => {
                                this.memberList![element.id] = element;
                            });
                            resolve(this.memberList);
                        });
                } else {
                    resolve(this.memberList);
                }
            });
        },
        fetchExpenses(groupCode: string, forceFetch?: boolean): Promise<Expense[]> {
            return new Promise((resolve) => {
                if (this.expenseList === undefined || forceFetch) {
                    fetch(`${import.meta.env.VITE_API_HOST}/groups/${groupCode}/expenses`)
                        .then((response) => response.json())
                        .then((data) => {
                            this.expenseList = data;
                            //resolve(data.sort(laterExpenseDate));
                            resolve(this.expenseList!);
                        });
                } else {
                    resolve(this.expenseList);
                }
            });
        },
    },
});

function laterExpenseDate(a, b): number {
    if (a.expense_paid_at < b.expense_paid_at) {
        return 1;
    }
    if (a.expense_paid_at > b.expense_paid_at) {
        return -1;
    }
    return 0;
}
