import { defineStore } from 'pinia';
import Member from '@/api-types/Member';
import Expense from '@/api-types/Expense';
import Group from '@/api-types/Group';

export type MemberRecord = { [memberId: string]: Member };

export const useApiStore = defineStore('api', {
    state: () => ({
        memberList: undefined as MemberRecord | undefined,
        expenseList: undefined as Expense[] | undefined,
        group: undefined as Group | undefined,
    }),
    getters: {
        getExpensesSortedByExpenseDate(): Expense[] | undefined {
            if (this.expenseList === undefined || this.expenseList?.length < 2) {
                return this.expenseList;
            }
            return this.expenseList.sort(laterExpenseDate);
        },
    },
    actions: {
        async fetchMembers(groupCode: string, forceFetch?: boolean): Promise<MemberRecord> {
            return this.fetchGroup(groupCode)
                .then(() => {
                    return new Promise<MemberRecord>((resolve, reject) => {
                        if (this.memberList === undefined || forceFetch) {
                            fetch(`${import.meta.env.VITE_API_HOST}/groups/${groupCode}/members`)
                                .then((response) => {
                                    if (response.status === 404) {
                                        reject('Group not found');
                                    }
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
                })
                .catch((error) => {
                    return error;
                });
        },
        fetchExpenses(groupCode: string, forceFetch?: boolean): Promise<Expense[]> {
            return new Promise((resolve, reject) => {
                if (this.expenseList === undefined || forceFetch) {
                    fetch(`${import.meta.env.VITE_API_HOST}/groups/${groupCode}/expenses`)
                        .then((response) => {
                            if (response.status >= 400) {
                                reject(response);
                            } else {
                                return response.json();
                            }
                        })
                        .then((data) => {
                            this.expenseList = data;
                            resolve(this.expenseList!);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                } else {
                    resolve(this.expenseList);
                }
            });
        },
        fetchGroup(groupCode: string): Promise<Group | undefined> {
            console.log(`${import.meta.env.VITE_API_HOST}/groups/${groupCode}/`);
            return new Promise((resolve, reject) => {
                fetch(`${import.meta.env.VITE_API_HOST}/groups/${groupCode}/`)
                    .then((response) => {
                        if (response.status >= 400) {
                            reject(response);
                        } else {
                            return response.json();
                        }
                    })
                    .then((group) => {
                        this.group = group;
                        resolve(this.group);
                    })
                    .catch((reason) => {
                        reject(reason);
                    });
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
