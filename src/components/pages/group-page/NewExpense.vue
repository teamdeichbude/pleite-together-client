<template>
    <div>
        <div class="fixed-action-btn">
            <a
                class="btn-floating btn-large scale-transition waves-effect waves-light modal-trigger"
                href="#new-expense-modal"
            >
                <i class="large material-icons">add</i>
            </a>
        </div>

        <!-- Modal Structure -->
        <div id="new-expense-modal" ref="sheetModal" class="modal bottom-sheet modal-fixed-footer">
            <form ref="formEl">
                <div class="modal-content">
                    <h4>Neuer Eintrag</h4>
                    <div class="row">
                        <label>Art</label>
                        <select v-model="expenseType" class="browser-default" required>
                            <option v-for="(type, key) in availableTypes" :key="key" :value="type">
                                {{ type }}
                            </option>
                        </select>
                    </div>
                    <div class="row">
                        <div class="row valign-wrapper">
                            <div class="input-field col s10">
                                <input
                                    id="amount"
                                    v-model="amount"
                                    placeholder="13.82"
                                    type="number"
                                    step="0.01"
                                    class="validate"
                                    required
                                />
                                <label for="amount">Betrag</label>
                            </div>
                            <div class="col s2"><span>EUR</span></div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <input
                                    id="title"
                                    v-model="title"
                                    placeholder="Bäcker"
                                    type="text"
                                    class="validate"
                                    required
                                />
                                <label for="title">Weswegen?</label>
                            </div>
                        </div>
                        <div class="row">
                            <label
                                >{{
                                    expenseType === availableTypes.expense
                                        ? 'Wer hat bezahlt?'
                                        : 'Wer hat das Geld bekommen?'
                                }}
                            </label>
                            <select v-model="payer" class="browser-default" required>
                                <option v-for="member in members" :key="member.id" :value="member.id">
                                    {{ member.name }}
                                </option>
                                <option value="new">Neuen Namen eingeben</option>
                            </select>
                        </div>
                        <div v-if="payer && payer == 'new'" class="row">
                            <div class="input-field col s12">
                                <input id="newName" v-model="newName" type="text" class="validate" />
                                <label for="newName">Name der neuen Person</label>
                            </div>
                        </div>

                        <div class="row">
                            <label for="within_group">
                                <input id="within_group" v-model="withinGroup" type="checkbox" />
                                <span>
                                    {{
                                        expenseType === availableTypes.expense
                                            ? 'Geld ging an jemand anderen aus der Gruppe'
                                            : 'Geld kam von jemand anderem aus der Gruppe'
                                    }}</span
                                ></label
                            >
                        </div>

                        <div v-if="withinGroup" class="row">
                            <label
                                >{{
                                    expenseType === availableTypes.income
                                        ? 'Von wem kam das Geld?'
                                        : 'Wer hat das Geld bekommen?'
                                }}
                            </label>
                            <select v-model="receiver" class="browser-default" required>
                                <option v-for="member in members" :key="member.id" :value="member.id">
                                    {{ member.name }}
                                </option>
                                <option value="new">Neuen Namen eingeben</option>
                            </select>
                        </div>
                        <div v-if="receiver && receiver == 'new'" class="row">
                            <div class="input-field col s12">
                                <input id="newNameReceiver" v-model="newNameReceiver" type="text" class="validate" />
                                <label for="newNameReceiver">Name der neuen Person</label>
                            </div>
                        </div>

                        <div class="row">
                            <div class="input-field col s8">
                                <input
                                    id="paid_at"
                                    ref="datepickerEl"
                                    v-model="paidAtDate"
                                    type="text"
                                    class="datepicker"
                                />
                                <label for="paid_at">Wann?</label>
                            </div>
                            <div class="input-field col s4">
                                <input
                                    id="paid_at_time"
                                    ref="timepickerEl"
                                    :value="paidAtTime"
                                    type="text"
                                    class="timepicker"
                                    @change="setTime"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <input
                        type="submit"
                        role="submit"
                        class="btn waves-effect waves-light modal-close"
                        value="Speichern"
                        @click="addNewExpense"
                    />
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref, computed, Ref, onUnmounted } from 'vue';
    import M from 'materialize-css';

    const props = defineProps<{ groupCode: string }>();

    const payer = ref();
    const newName = ref();
    const amount = ref();
    const title = ref();
    const datepickerEl = ref();
    const timepickerEl = ref();
    const sheetModal = ref();
    const availableTypes = { expense: 'Ausgabe', income: 'Einnahme' };
    const expenseType = ref();
    expenseType.value = availableTypes.expense;

    const withinGroup = ref();
    const receiver = ref();
    const newNameReceiver = ref();

    let datePickerInstance;
    const formEl: Ref<HTMLFormElement | undefined> = ref();

    const paidAtISODateTimeString = computed(() => {
        const theDate = new Date(datePickerInstance.date.toDateString() + ' ' + paidAtTime.value);
        return theDate.toISOString();
    });

    const paidAtDate = ref();
    paidAtDate.value = new Date().toLocaleDateString('de-DE', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    });

    const paidAtTime = ref();
    const time = new Date().toLocaleTimeString('de-DE', { hour12: false, hour: '2-digit', minute: '2-digit' });
    paidAtTime.value = time;

    function setTime(event) {
        paidAtTime.value = event.target.value;
    }

    const members = ref();
    members.value = [];

    function fetchGroupMembers() {
        fetch(`${import.meta.env.VITE_API_HOST}/groups/${props.groupCode}/members`)
            .then((response) => response.json())
            .then((data) => (members.value = data));
    }

    function addNewExpense() {
        let error = false;
        console.log(paidAtISODateTimeString.value);

        //the user can decide if he creates a within group transaction from the perspective of
        //the payer or receiver. We will give it to the API always from the perspective of
        //the payer.
        const switchPayerAndReceiver = withinGroup.value && expenseType.value === 'Einnahme';
        const newNameKey = switchPayerAndReceiver ? 'receivingMemberName' : 'newMemberName';
        const payerKey = switchPayerAndReceiver ? 'receivingMemberId' : 'memberId';
        const receiverKey = switchPayerAndReceiver ? 'memberId' : 'receivingMemberId';
        const newNameReceiverKey = switchPayerAndReceiver ? 'newMemberName' : 'receivingMemberName';

        const requestBody = {
            amount: amount.value * 100,
            title: title.value,
            paidAt: paidAtISODateTimeString.value,
        };

        if (newName.value) {
            requestBody[newNameKey] = newName.value;
        } else if (payer.value && payer.value !== 'new') {
            requestBody[payerKey] = payer.value;
        } else {
            error = true;
        }

        if (withinGroup.value) {
            if (receiver.value && receiver.value !== 'new') {
                requestBody[receiverKey] = receiver.value;
            } else if (receiver.value === 'new' && newNameReceiver.value) {
                requestBody[newNameReceiverKey] = newNameReceiver.value;
            } else {
                error = true;
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
            console.log('error');
        }
    }

    function preventFormSubmit(e: any) {
        e.preventDefault();
    }

    onUnmounted(() => {
        if (formEl.value) {
            formEl.value.removeEventListener('submit', preventFormSubmit);
        }
    });

    onMounted(() => {
        if (formEl.value) {
            formEl.value.addEventListener('submit', preventFormSubmit);
        }
        fetchGroupMembers();

        M.Modal.init(sheetModal.value, {});

        datePickerInstance = M.Datepicker.init(datepickerEl.value, {
            format: 'dd.mm.yy',
            defaultDate: new Date(),
            setDefaultDate: true,
            firstDay: 1,
            i18n: {
                cancel: 'Abbrechen',
                months: [
                    'Januar',
                    'Februar',
                    'März',
                    'April',
                    'Mai',
                    'Juni',
                    'Juli',
                    'August',
                    'September',
                    'Oktober',
                    'November',
                    'Dezember',
                ],
                monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                weekdaysAbbrev: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            },
        });
        //var dateElements = document.querySelectorAll('.datepicker');

        M.Timepicker.init(timepickerEl.value, { twelveHour: false, defaultTime: time });
    });
</script>

<style lang="scss">
    .modal.bottom-sheet {
        max-height: 100%;
        input[type='submit'] {
            color: white;
        }
    }

    .datepicker-container.modal-content,
    .timepicker-container.modal-content {
        position: relative !important;
    }
</style>
