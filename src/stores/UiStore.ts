import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
    state: () => ({
        modalOpen: false,
    }),
    actions: {
        openModal() {
            this.modalOpen = true;
        },
        closeModal() {
            this.modalOpen = false;
        },
    },
});
