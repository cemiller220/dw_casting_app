<template>
    <!--    <casting-status-all-dancers></casting-status-all-dancers>-->
    <div>
        <base-card>
            <pref-header type="dancer" page="run_casting"></pref-header>
        </base-card>
        <div class="row align-items-center">
            <div class="col-8">
                <base-card class="h-95">
                    <dancer-pref-info page="run_casting"
                                      :showDropped="showDropped"
                                      :currentPref="currentPref" :view="view"
                                      :prefsValid="prefsValid" :casting_mode="casting_mode">
                    </dancer-pref-info>
                </base-card>
            </div>
            <div class="col-4 ">
                <base-card class="h-95">
                    <casting-changes></casting-changes>
                </base-card>
            </div>
        </div>
        <calendar-view v-if="view === 'calendar'"
                       page="run_casting"
                       :keep-drop="keepDrop"
                       :show-dropped="showDropped"
                       :current-pref="currentPref"
                       :current-dancer-statuses="currentDancerStatuses"></calendar-view>
        <div class="row justify-content-center" v-if="view === 'list'">
            <div class="col-4">
                <base-card>
                    <dancer-pref-group page="run_casting"
                                       :keep-drop="keepDrop"
                                       :show-dropped="showDropped"
                                       :current-pref="currentPref"
                                       :current-dancer-statuses="currentDancerStatuses">
                    </dancer-pref-group>
                </base-card>
            </div>
        </div>
        <base-button @click="calculateThenInitialize({functionName: 'start_casting'})">Start Casting</base-button>
        <base-button @click="calculateThenInitialize({functionName: 'drop_all_same_times'})">Drop All Same Times</base-button>
    </div>
</template>

<script>
    import BaseCard from "../components/UI/BaseCard";
    import PrefHeader from "../components/pref_sheets/PrefHeader";
    import DancerPrefInfo from "../components/pref_sheets/dancer/DancerPrefInfo";
    import DancerPrefGroup from "../components/pref_sheets/dancer/DancerPrefGroup";
    import {mapActions, mapGetters} from "vuex";
    import CalendarView from "../components/pref_sheets/dancer/calendar_view/CalendarView";
    import BaseButton from "../components/UI/BaseButton";
    import CastingChanges from "../components/pref_sheets/dancer/casting_helpers/CastingChanges";
    // import CastingStatusAllDancers from "../components/pref_sheets/dancer/casting_helpers/CastingStatusAllDancers";
    export default {
        name: "DancerPrefs",
        components: {CastingChanges, BaseButton, CalendarView, DancerPrefGroup, DancerPrefInfo, PrefHeader, BaseCard},
        computed: {
            ...mapGetters('run_casting', ['view', 'keepDrop', 'currentPref', 'currentDancerStatuses', 'showDropped', 'prefsValid', 'casting_mode']),
        },
        methods: {
            ...mapActions('run_casting', ['calculateThenInitialize'])
        },
        created() {
            this.calculateThenInitialize({functionName: 'keep_drop', change_direction: 'next'});
        }
    }
</script>

<style scoped>
    .h-95 {
        height: 93%;
        max-height: 300px;
        overflow-y: auto;
    }
</style>
