<template>
<!--    <casting-status-all-dancers></casting-status-all-dancers>-->
    <div>
        <base-card>
            <pref-header type="dancer"></pref-header>
        </base-card>
        <div class="row align-items-center" v-if="page === 'cast'">
            <div class="col-8">
                <base-card class="h-95">
                    <dancer-pref-info :type="page">
                    </dancer-pref-info>
                </base-card>
            </div>
            <div class="col-4 ">
                <base-card class="h-95">
                    <casting-changes></casting-changes>
                </base-card>
            </div>
        </div>
        <base-card v-else>
            <dancer-pref-info :type="page"></dancer-pref-info>
        </base-card>
        <calendar-view v-if="view === 'calendar'" :type="page"></calendar-view>
        <div class="row justify-content-center" v-if="view === 'list'">
            <div class="col-4">
                <base-card>
                    <dancer-pref-group :type="page">
                    </dancer-pref-group>
                </base-card>
            </div>
        </div>
        <base-button @click="calculateThenInitialize({functionName: 'start_casting'})" v-if="page === 'cast'">Start Casting</base-button>
        <base-button @click="calculateThenInitialize({functionName: 'drop_all_same_times'})" v-if="page === 'cast'">Drop All Same Times</base-button>
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
            ...mapGetters('prefs', ['view']),
            page() {
                if (this.$router.currentRoute.value.fullPath === '/prefs/dancer') {
                    return 'pref'
                } else {
                    return 'cast'
                }
            }
        },
        methods: {
            ...mapActions('prefs', ['loadAllData', 'toggleView', 'calculateThenInitialize'])
        },
        created() {
            this.loadAllData();
            if (this.$router.currentRoute.value.fullPath === '/run_casting') {
                this.toggleView({view: 'calendar'});
            }
        }
    }
</script>

<style scoped>
.h-95 {
    height: 93%;
    max-height: 250px;
    overflow-y: auto;

}
</style>
