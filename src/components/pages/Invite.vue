<template>
    <div>
        <h2>Gruppe teilen</h2>
        <div>
            <div>
                <div class="card invite-card">
                    <qrcode-vue class="qr-code" :value="registerLink" :size="100" level="H" />
                    <hr />
                    <div>Zugangscode: {{ groupId }}</div>
                    <hr />
                    <div class="text-center">Link zur Gruppe: {{ registerLink }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ComputedRef } from '@vue/reactivity';

    import { useApiStore } from '@/stores/ApiStore';
    import { useRoute, useRouter } from 'vue-router';

    import QrcodeVue from 'qrcode.vue';

    const route = useRoute();
    const groupId: ComputedRef<string> = computed(() => {
        useApiStore()
            .fetchGroup(route.params.groupId.toString())
            .then((group) => {
                return group?.code;
            })
            .catch(() => {
                useRouter().push('404');
            });
        return route.params.groupId.toString();
    });

    const registerLink = computed(() => {
        return `${window.location.protocol}//${window.location.host}/gruppe-${route.params.groupId}`;
    });
</script>

<style scoped lang="scss">
    h2 {
        color: $font-light;
    }

    .invite-card {
        align-items: center;
        gap: 1rem;

        hr {
            width: 100%;
            opacity: 0.3;
        }
        .text-center {
            text-align: center;
        }
    }
</style>
