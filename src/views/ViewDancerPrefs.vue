<template>
    <div>
        <base-card>
            <pref-header type="dancer"></pref-header>
        </base-card>
        <base-card>
            <dancer-pref-info :type="page">
            </dancer-pref-info>
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
        <base-button @click="startCasting" v-if="page === 'cast'">Start Casting</base-button>
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
    export default {
        name: "DancerPrefs",
        components: {BaseButton, CalendarView, DancerPrefGroup, DancerPrefInfo, PrefHeader, BaseCard},
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
            ...mapActions('prefs', ['loadAllData', 'inializeData', 'toggleView', 'startCasting'])
        },
        created() {
            this.loadAllData().then(() => {
                this.inializeData();
            });
            if (this.$router.currentRoute.value.fullPath === '/run_casting') {
                this.toggleView();
            }
        }
    }
</script>

<style scoped>

</style>
