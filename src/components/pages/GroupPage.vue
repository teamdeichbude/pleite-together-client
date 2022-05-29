<template>
    <article class="container">
        <section class="section">
            <h1>Gruppe mit ID: {{ groupId }}</h1>

            <new-expense :group-code="groupId"></new-expense>

            <div class="row">
                <div class="col s12">
                    <ul ref="tabsListEl" class="tabs">
                        <li class="tab col s4"><a class="active" href="#test1">Zahlungen</a></li>
                        <li class="tab col s4"><a href="#test2">Benutzer</a></li>
                        <li class="tab col s4"><a href="#test3">Einstellungen</a></li>
                    </ul>
                </div>
                <div id="test1" class="col s12">
                    <expense-list :group-invite="groupId" />
                </div>
                <div id="test2" class="col s12">Test 2</div>
                <div id="test3" class="col s12">
                    <h2>Nutzer hinzufügen</h2>
                    <p>Lade neue Leute über diesen Code / Link / QR-Code ein</p>

                    <div class="container">
                        <div class="row">
                            <div class="card col s12 l10">
                                <div class="invite-card card-content">
                                    <qrcode-vue class="qr-code" :value="registerLink" :size="100" level="H" />

                                    <div class="input-field col s7">
                                        <input id="copy-link-text-field" disabled :value="registerLink" type="text" />
                                        <span class="helper-text">Beitritts-Link</span>
                                    </div>
                                    <div class="input-field col s7">
                                        <input id="copy-link-text-field" disabled :value="groupId" type="text" />
                                        <span class="helper-text">Beitritts-Code</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </article>
</template>

<script setup lang="ts">
    import { computed, ComputedRef } from '@vue/reactivity';
    import { useRoute } from 'vue-router';
    import M from 'materialize-css';
    import { onMounted, ref, Ref } from 'vue';

    import QrcodeVue from 'qrcode.vue';
    import ExpenseList from './group-page/ExpenseList.vue';
    import NewExpense from './group-page/NewExpense.vue';

    const route = useRoute();

    const registerLink = computed(() => {
        return `${window.location.protocol}//${window.location.host}/gruppe-${route.params.groupId}`;
    });

    const tabsListEl: Ref<HTMLUListElement | undefined> = ref();

    const groupId: ComputedRef<string> = computed(() => {
        return route.params.groupId.toString();
    });

    // function loadGroupData() {
    //     fetch(`http://localhost:3001/groups/${groupId.value}/expenses`)
    //         .then((response) => response.json())
    //         .then((data) => (groupExpenses.value = data));
    // }

    onMounted(() => {
        if (tabsListEl.value) {
            M.Tabs.init(tabsListEl.value, {});
        }

        // loadGroupData();
    });
</script>

<style scoped lang="scss">
    .fixed-action-btn {
        right: 10%;
        bottom: 10%;
    }

    .expense-list {
        li {
            display: flex;
            width: 80%;
            justify-content: space-between;
            text-align: left;
        }
    }

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
