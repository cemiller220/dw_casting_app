<template>
    <div>
        <base-card>
            <pref-header type="dancer"></pref-header>
        </base-card>
        <base-card>
            <dancer-pref-info>
            </dancer-pref-info>
        </base-card>
        <calendar-view v-if="view === 'calendar'"></calendar-view>
        <div class="row justify-content-center" v-if="view === 'list'">
            <div class="col-4">
                <base-card>
                    <dancer-pref-group>
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
            ...mapGetters('prefs', ['view'])
        },
        methods: {
            ...mapActions('prefs', ['loadAllData', 'inializeData', 'clearData'])
        },
        created() {
            this.clearData().then(() => {
                this.loadAllData().then(() => {
                    this.inializeData();
                });
            })

        }
    }
</script>

<style scoped>

</style>
