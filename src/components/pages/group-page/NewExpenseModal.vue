<template>
    <teleport to="#root">
        <div v-if="open" class="modal">
            <div id="new-expense-modal" class="card modal-card modal-fixed-footer">
                <div class="modal-header">
                    <h3>Neuer Eintrag</h3>
                    <i class="tiny material-icons float-right" @click="$emit('closeModal')">close</i>
                </div>
                <form @submit.prevent="addNewExpense">
                    <div class="modal-content">
                        <input-select
                            id="new-expense-type"
                            label="Art"
                            :model-value="expenseType"
                            :available-options="availableTypes"
                            placeholder="Art des Eintrags"
                            @update:model-value="(newValue) => (expenseType = newValue)"
                        ></input-select>

                        <input-field
                            id="new-expense-amount"
                            label="Betrag (EUR)"
                            suffix="EUR"
                            input-type="text"
                            placeholder="15,00 oder einfach 15"
                            pattern="[0-9]{1,}(,[0-9]{2})?"
                            :title="
                                'Der Betrag in Euro, mit Komma vor den Cents.' +
                                'Z.B.: 1,20 oder 5,00 oder auch einfach 5'
                            "
                            required
                            :model-value="amount"
                            @update:model-value="(newValue) => (amount = newValue)"
                        ></input-field>

                        <input-field
                            id="new-expense-title"
                            label="Titel"
                            required
                            :model-value="title"
                            @update:model-value="(newValue) => (title = newValue)"
                        ></input-field>

                        <input-select
                            id="new-expense-member"
                            :label="
                                expenseType === availableTypes.expense.key
                                    ? 'Wer hat bezahlt?'
                                    : 'Wer hat das Geld bekommen?'
                            "
                            :model-value="payer"
                            :available-options="membersSelect"
                            placeholder="Mitglied wählen"
                            @update:model-value="(newValue) => (payer = newValue)"
                        ></input-select>

                        <input-field
                            v-if="payer && payer == 'new'"
                            id="new-expense-new-member"
                            :required="true"
                            label="Neuer Name"
                            :model-value="newName"
                            @update:model-value="(newValue) => (newName = newValue)"
                        ></input-field>

                        <checkbox
                            id="within-group-checkbox"
                            :label="
                                expenseType === availableTypes.expense.key
                                    ? 'Geld ging an jemand anderen aus der Gruppe'
                                    : 'Geld kam von jemand anderem aus der Gruppe'
                            "
                            :model-value="withinGroup"
                            @update:model-value="(newValue) => (withinGroup = newValue)"
                        >
                        </checkbox>

                        <input-select
                            v-if="withinGroup"
                            id="new-expense-receiver"
                            :label="
                                expenseType === availableTypes.expense.key
                                    ? 'Wer hat das Geld bekommen?'
                                    : 'Von wem kam das Geld?'
                            "
                            :model-value="receiver"
                            :available-options="membersSelect"
                            :required="true"
                            placeholder="Mitglied wählen"
                            @update:model-value="(newValue) => (receiver = newValue)"
                        ></input-select>

                        <input-field
                            v-if="receiver && receiver == 'new'"
                            id="new-expense-receiver-name"
                            :required="true"
                            label="Neuer Name"
                            :model-value="newNameReceiver"
                            @update:model-value="(newValue) => (newNameReceiver = newValue)"
                        ></input-field>

                        <input-field
                            id="new-expense-paid-at"
                            label="Datum"
                            placeholder="dd.mm.yyyy"
                            pattern="[0-9]{2}.[0-9]{2}.[0-9]{4}"
                            :model-value="paidAtDate"
                            @update:model-value="(newValue) => (paidAtDate = newValue)"
                        ></input-field>

                        <input-field
                            id="new-expense-paid-at-time"
                            label="Uhrzeit"
                            placeholder="hh:mm"
                            :model-value="paidAtTime"
                            @update:model-value="(newValue) => (paidAtTime = newValue)"
                        ></input-field>
                    </div>
                    <div class="modal-footer">
                        <input type="submit" role="submit" value="Speichern" />
                    </div>
                </form>
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
    import Checkbox from '@/components/Checkbox.vue';
    import InputField from '@/components/InputField.vue';
    import InputSelect from '@/components/InputSelect.vue';
    import { onMounted, ref, computed } from 'vue';

    defineEmits(['closeModal']);

    const props = defineProps<{ groupCode: string; open: boolean }>();

    const payer = ref<undefined | string>();
    const newName = ref('');
    const amount = ref('');
    const title = ref('');
    const availableTypes = {
        expense: { key: 'expense', value: 'Ausgabe' },
        income: { key: 'income', value: 'Einnahme' },
    };
    const expenseType = ref(availableTypes.expense.key);

    const withinGroup = ref(false);
    const receiver = ref<undefined | string>();
    const newNameReceiver = ref('');

    const paidAtISODateTimeString = computed(() => {
        const dateParts = paidAtDate.value.split('.'); //e.g. 31.12.2023
        const dateString = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
        const timeString = paidAtTime.value + ':00';
        const theDate = new Date(dateString + ' ' + timeString);
        return theDate.toISOString();
    });

    const membersSelect = ref();
    membersSelect.value = [];

    const paidAtDate = ref();
    paidAtDate.value = new Date().toLocaleDateString('de-DE', {
        year: 'numeric', //means 2023
        month: '2-digit',
        day: '2-digit',
    });

    const paidAtTime = ref();
    const time = new Date().toLocaleTimeString('de-DE', { hour12: false, hour: '2-digit', minute: '2-digit' });
    paidAtTime.value = time;

    const members = ref();
    members.value = new Array();

    function fetchGroupMembers() {
        fetch(`${import.meta.env.VITE_API_HOST}/groups/${props.groupCode}/members`)
            .then((response) => response.json())
            .then((data) => {
                members.value = data;
                let options = {};
                for (const member of members.value) {
                    options[member.id] = { key: member.id, value: member.name };
                }
                options['new'] = { key: 'new', value: 'Neuen Namen eingeben' };

                membersSelect.value = options;
            });
    }

    function addNewExpense() {
        let error = '';

        //the user can decide if he creates a within group transaction from the perspective of
        //the payer or receiver. We will give it to the API always from the perspective of
        //the payer.
        const switchPayerAndReceiver = withinGroup.value && expenseType.value === 'Einnahme';
        const newNameKey = switchPayerAndReceiver ? 'receivingMemberName' : 'newMemberName';
        const payerKey = switchPayerAndReceiver ? 'receivingMemberId' : 'memberId';
        const receiverKey = switchPayerAndReceiver ? 'memberId' : 'receivingMemberId';
        const newNameReceiverKey = switchPayerAndReceiver ? 'newMemberName' : 'receivingMemberName';

        let requestAmount = amount.value * 100;
        if (expenseType.value == availableTypes.income.key) {
            requestAmount *= -1;
        }

        const requestBody = {
            amount: requestAmount,
            title: title.value,
            paidAt: paidAtISODateTimeString.value,
        };

        if (newName.value) {
            requestBody[newNameKey] = newName.value;
        } else if (payer.value && payer.value !== 'new') {
            requestBody[payerKey] = payer.value;
        } else {
            error += 'New payer but no name!';
        }

        if (withinGroup.value) {
            if (receiver.value && receiver.value !== 'new') {
                requestBody[receiverKey] = receiver.value;
            } else if (receiver.value === 'new' && newNameReceiver.value) {
                requestBody[newNameReceiverKey] = newNameReceiver.value;
            } else {
                error += ' New receiver but no name!';
            }
        }

        if (!error) {
            fetch(`${import.meta.env.VITE_API_HOST}/groups/${props.groupCode}/expenses`, {
                method: 'POST',
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    window.location.reload();
                });
        } else {
            console.log('error: ' + error);
        }
    }

    onMounted(() => {
        fetchGroupMembers();
    });
</script>

<style lang="scss">
    .modal {
        /*prevent the passing of the scrolling to the parent */
        overscroll-behavior: contain;

        position: fixed;
        z-index: 101;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        width: 100vw;
        max-height: 100vh;
        height: -webkit-fill-available;
        display: flex;
        align-items: center;
        box-sizing: border-box;

        .card {
            padding: 0;
            box-sizing: border-box;
        }
        .float-right {
            float: right;
            text-align: right;
        }
        input[type='submit'] {
            color: white;
        }
        .modal-header,
        .modal-content,
        .modal-footer {
            padding: 1rem;
            /*prevent the passing of the scrolling to the parent */
            overscroll-behavior: contain;
        }
        .modal-header {
            border-bottom: 2px solid rgba(0, 0, 0, 0.2);

            display: flex;
            justify-content: space-between;
            align-items: center;
            h3 {
                margin: 0.5rem 0;
            }
        }
        .modal-content {
            align-items: center;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            height: 70vh;
            overflow: scroll;
            padding-right: 1rem;
            box-sizing: border-box;
            width: 100%;
        }
        .modal-footer {
            border-top: 2px solid rgba(0, 0, 0, 0.2);

            input {
                width: 100%;
                margin-bottom: 1rem;
            }
        }
    }

    .datepicker-container.modal-content,
    .timepicker-container.modal-content {
        position: relative !important;
    }
</style>
