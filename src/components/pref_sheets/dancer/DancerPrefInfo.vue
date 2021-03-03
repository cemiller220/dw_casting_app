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
    <div class="row justify-content-center">
        <div class="col-auto">
            <base-button @click="toggleShowDropped">
                {{ showDropped ? 'Hide' : 'Show' }} Dropped Pieces
            </base-button>
            <base-button @click="toggleView">
                Switch to {{ view === 'list' ? 'Calendar' : 'List' }} View
            </base-button>
            <base-button @click="saveChanges">
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
            ...mapGetters('prefs', ['showDropped', 'currentPref', 'view', 'prefsValid']),
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
            }
        },
        methods: {
            ...mapActions('prefs', ['toggleShowDropped', 'toggleView', 'saveChanges'])
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
</style>
