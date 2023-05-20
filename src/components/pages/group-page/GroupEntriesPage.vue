<template>
    <article v-if="!error" class="full-width">
        <new-expense-button :group-code="groupId"></new-expense-button>

        <expense-list :group-invite="groupId" />
    </article>
    <article v-else-if="error?.status === 404">Diese Gruppe gibt es nicht.</article>
    <article v-else>
        Oh oh... da ist etwas schief gelaufen :(
        <p>
            Details:<br />
            {{ error }}
        </p>
    </article>
</template>

<script setup lang="ts">
    import { computed, ComputedRef } from '@vue/reactivity';
    import { useRoute } from 'vue-router';
    import { ref } from 'vue';

    import ExpenseList from './ExpenseList.vue';
    import { useApiStore } from '@/stores/ApiStore';
    import NewExpenseButton from './NewExpenseButton.vue';

    const route = useRoute();
    const error = ref(null);

    const groupId: ComputedRef<string> = computed(() => {
        useApiStore()
            .fetchGroup(route.params.groupId.toString())
            .then((group) => {
                return group?.code;
            })
            .catch((reason) => {
                error.value = reason;
            });
        return route.params.groupId.toString();
    });
</script>

<style scoped lang="scss">
    .invite-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .qr-code {
            background-color: $primary-color-light;
            padding: 5px;
        }
    }
</style>
