<template>
    <transition name="fade">
        <nav v-if="group">
            <div class="nav-wrapper">
                <div>
                    <router-link to="/"><i class="material-icons">arrow_back r</i></router-link>
                </div>
                <div>
                    <span class="groupId">{{ group }}</span>
                </div>
            </div>
            <div v-if="group" class="nav-links">
                <ul>
                    <li>
                        <router-link :to="{ name: 'entries', params: { groupId: useRoute().params.groupId } }"
                            >Einträge</router-link
                        >
                    </li>
                    <li>
                        <router-link :to="{ name: 'settlement', params: { groupId: useRoute().params.groupId } }">
                            Abrechnung</router-link
                        >
                    </li>
                    <li>
                        <router-link :to="{ name: 'invite', params: { groupId: useRoute().params.groupId } }"
                            >Teilen</router-link
                        >
                    </li>
                </ul>
            </div>
        </nav>
    </transition>
</template>

<script lang="ts" setup>
    import { useApiStore } from '@/stores/ApiStore';
    import { computed, ComputedRef } from '@vue/reactivity';
    import { useRoute } from 'vue-router';

    const group: ComputedRef<string | undefined> = computed(() => {
        if (useRoute().params.groupId) {
            window.document.body.classList.toggle('whitebg', true);
            return useApiStore().group?.name ?? useApiStore().group?.code;
        }
        window.document.body.classList.toggle('whitebg', false);

        return '';
    });
</script>

<style lang="scss">
    nav {
        background-color: $header-bg-color;
        position: fixed;
        width: 100%;
        z-index: 100;

        .nav-wrapper {
            padding: 10px 20px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            height: 3rem;
            width: 100%;
            .material-icons {
                font-size: 1.2rem;
            }
        }

        .nav-links {
            position: relative;
            padding: 0.2rem 0 1rem 0;
            &::before,
            &::after {
                content: '';
                background-image: linear-gradient(90deg, $header-bg-color, transparent);
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 1rem;
            }
            &::after {
                background-image: linear-gradient(270deg, $header-bg-color, transparent);
                right: 0;
                left: auto;
            }
            ul {
                list-style: none;
                display: flex;
                margin: 0;
                padding: 0;
                padding-bottom: 0.5rem;
                margin-bottom: -1rem;
                box-sizing: border-box;
                overflow: scroll;
                position: relative;

                li {
                    display: inline;
                    width: 33vw;
                    text-align: center;
                    a {
                        margin: 0 0.7rem;
                        padding: 0 0.2rem 0.35rem 0.2rem;
                        color: $black-lighter;
                        &:hover {
                            text-decoration: none;
                            color: $primary-color;
                        }
                        &.router-link-active {
                            color: $primary-color;
                            border-bottom: 2px solid $primary-color;
                        }
                    }
                }
            }
        }
    }
</style>
