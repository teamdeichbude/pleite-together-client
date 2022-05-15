<template>
    <article class="container">
        <section class="section">
            <h1>Gruppe mit ID: {{ groupId }}</h1>

            <div class="row">
                <div class="col s12">
                    <ul ref="tabsListEl" class="tabs">
                        <li class="tab col s3"><a class="active" href="#test1">Zahlungen</a></li>
                        <li class="tab col s3"><a href="#test2">Benutzer</a></li>
                        <li class="tab col s3"><a href="#test3">Einstellungen</a></li>
                    </ul>
                </div>
                <div id="test1" class="col s12">
                    <h2>Hier kommt die Liste</h2>
                </div>
                <div id="test2" class="col s12">Test 2</div>
                <div id="test3" class="col s12">
                    <h3>Nutzer hinzufügen</h3>
                    <p>Lade nutzer mit über diesen Code / Link / QR-Code ein</p>

                    <div class="container">
                        <div class="row">
                            <div class="card teal darken-4 col s10">
                                <div class="invite-card card-content white-text">
                                    <qrcode-vue class="qr-code" :value="registerLink" :size="100" level="H" />

                                    <div class="input-field col s7">
                                        <input
                                            disabled
                                            id="copy-link-text-field"
                                            class="white-text"
                                            :value="registerLink"
                                            type="text"
                                        />
                                        <span class="helper-text teal-text text-lighten-3">Beitritts-Link</span>
                                    </div>
                                    <div class="input-field col s7">
                                        <input
                                            disabled
                                            id="copy-link-text-field"
                                            class="white-text"
                                            :value="groupId"
                                            type="text"
                                        />
                                        <span class="helper-text teal-text text-lighten-3">Beitritts-Code</span>
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
    import { computed } from '@vue/reactivity';
    import { useRoute } from 'vue-router';
    import M from 'materialize-css';
    import { onMounted, ref, Ref } from 'vue';

    import QrcodeVue from 'qrcode.vue';

    const route = useRoute();

    const registerLink = computed(() => {
        return `${window.location.protocol}//${window.location.host}/gruppe-${route.params.groupId}`;
    });

    const tabsListEl: Ref<HTMLUListElement | undefined> = ref();

    const groupId = computed(() => {
        return route.params.groupId;
    });

    onMounted(() => {
        M.AutoInit();

        if (tabsListEl.value) M.Tabs.init(tabsListEl.value, {});
    });
</script>

<style scoped lang="scss">
    .invite-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .qr-code {
            background-color: #009688;
            padding: 5px;
        }
    }
</style>
