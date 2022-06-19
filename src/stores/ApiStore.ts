import { defineStore } from 'pinia';
import Member from '@/api-types/Member';

export type MemberRecord = { [key: string]: Member };

export const useApiStore = defineStore('api', {
    state: () => ({
        memberList: undefined as MemberRecord | undefined,
    }),
    getters: {},
    actions: {
        async getMembers(group: string, forceFetch?: boolean): Promise<MemberRecord> {
            //todo add reject (e.g. group doesn't exist)
            return new Promise<MemberRecord>((resolve) => {
                if (this.memberList === undefined || forceFetch) {
                    fetch(`${import.meta.env.VITE_API_HOST}/groups/${group}/members`)
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
    },
});
