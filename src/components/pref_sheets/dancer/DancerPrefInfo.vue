<template>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h3>Dancer: <strong>{{ currentPref.name }}</strong></h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h4 :class="dancesValidClass">Max Dances: <strong>{{ currentPref.max_dances }}</strong></h4>
        </div>
        <div class="col-auto">
            <h4 :class="daysValidClass">Max Days: <strong>{{ currentPref.max_days }}</strong></h4>
        </div>
    </div>
    <div class="row justify-content-center" v-if="prefsValid.same_time">
        <div class="col-auto">
            <h4 class="more">Warning: Cast in 2 Pieces At Same Time</h4>
        </div>
    </div>
    <div class="row justify-content-center" v-if="prefsValid.done">
        <div class="col-auto">
            <h4 class="match">Done casting this dancer!</h4>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h4>Notes: {{ currentPref.notes }}</h4>
        </div>
    </div>
    <div class="row justify-content-center" v-if="page === 'cast'">
        <div class="col-auto">
            <div class="switch-field">
                <input type="radio" id="radio-one" name="switch-one"
                       value="standard" :checked="casting_mode === 'standard'"
                       @change="updateCastingMode('standard')"/>
                <label for="radio-one">Standard</label>
                <input type="radio" id="radio-two" name="switch-one"
                       value="finalize" :checked="casting_mode === 'finalize'"
                       @change="updateCastingMode('finalize')"/>
                <label for="radio-two">Finalize</label>
            </div>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-auto">
            <base-button @click="toggleShowDropped">
                {{ showDropped ? 'Hide' : 'Show' }} Dropped Pieces
            </base-button>
            <base-button @click="toggleView">
                Switch to {{ view === 'list' ? 'Calendar' : 'List' }} View
            </base-button>
            <base-button @click="saveChanges" v-if="page === 'cast'">
                Save Changes
            </base-button>
        </div>
    </div>
</template>

<script>
    import BaseButton from "../../UI/BaseButton";
    import {mapActions, mapGetters} from 'vuex';

    export default {
        name: "DancerPrefInfo",
        components: {BaseButton},
        props: ['type'],
        computed: {
            ...mapGetters('prefs', ['showDropped', 'currentPref', 'view', 'prefsValid', 'casting_mode']),
            daysValidClass() {
                if (this.type === 'cast') {
                    return this.prefsValid.max_days
                }
                return ''
            },
            dancesValidClass() {
                if (this.type === 'cast') {
                    return this.prefsValid.max_dances
                }
                return ''
            },
            page() {
                if (this.$router.currentRoute.value.fullPath === '/prefs/dancer') {
                    return 'pref'
                } else {
                    return 'cast'
                }
            }
        },
        methods: {
            ...mapActions('prefs', ['toggleShowDropped', 'toggleView', 'saveChanges', 'toggleCastingMode']),
            updateCastingMode(new_mode) {
                this.toggleCastingMode({new_mode})
            }
        }
    }
</script>

<style scoped>
    .match {
        color: green;
    }

    .more {
        color: red;
    }

    .switch-field {
        display: flex;
        margin-bottom: 1rem;
        overflow: hidden;
    }

    .switch-field input {
        position: absolute !important;
        clip: rect(0, 0, 0, 0);
        height: 1px;
        width: 1px;
        border: 0;
        overflow: hidden;
    }

    .switch-field label {
        background-color: #e4e4e4;
        color: rgba(0, 0, 0, 0.6);
        font: inherit;
        /*line-height: 1;*/
        text-align: center;
        padding: 0.5rem 1.5rem;
        margin-right: -1px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1);
        transition: all 0.1s ease-in-out;
    }

    .switch-field label:hover {
        cursor: pointer;
    }

    .switch-field input:checked + label {
        color: white;
        background-color: #3a0061;
        box-shadow: none;
    }

    .switch-field label:first-of-type {
        border-radius: 50px 0 0 50px;
    }

    .switch-field label:last-of-type {
        border-radius: 0 50px 50px 0;
    }
</style>
