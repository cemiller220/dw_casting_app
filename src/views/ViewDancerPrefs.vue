<template>
    <div>
        <base-card>
            <pref-header type="dancer" page="prefs"></pref-header>
        </base-card>
        <base-card>
            <dancer-pref-info page="prefs" :showDropped="showDropped"
                              :currentPref="currentPref" :view="view"></dancer-pref-info>
        </base-card>
        <calendar-view v-if="view === 'calendar'"
                       page="prefs"
                       :keep-drop="{}"
                       :show-dropped="showDropped"
                       :current-pref="currentPref"
                       :current-dancer-statuses="currentDancerStatuses"></calendar-view>
        <div class="row justify-content-center" v-if="view === 'list'">
            <div class="col-4">
                <base-card>
                    <dancer-pref-group page="prefs"
                                       :keep-drop="{}"
                                       :show-dropped="showDropped"
                                       :current-pref="currentPref"
                                       :current-dancer-statuses="currentDancerStatuses">
                    </dancer-pref-group>
                </base-card>
            </div>
        </div>
    </div>
</template>

<script>
    import BaseCard from "../components/UI/BaseCard";
    import PrefHeader from "../components/pref_sheets/PrefHeader";
    import DancerPrefInfo from "../components/pref_sheets/dancer/DancerPrefInfo";
    import DancerPrefGroup from "../components/pref_sheets/dancer/DancerPrefGroup";
    import {mapActions, mapGetters} from "vuex";
    import CalendarView from "../components/pref_sheets/dancer/calendar_view/CalendarView";

    export default {
        name: "DancerPrefs",
        components: {CalendarView, DancerPrefGroup, DancerPrefInfo, PrefHeader, BaseCard},
        computed: {
            ...mapGetters('prefs', ['view', 'currentPref', 'currentDancerStatuses', 'showDropped']),
        },
        methods: {
            ...mapActions('prefs', ['loadAllData', 'toggleView']),
        },
        created() {
            this.loadAllData();
        }
    }
</script>

<style scoped>

</style>
