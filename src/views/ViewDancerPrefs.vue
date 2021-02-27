<template>
    <div>
        <base-card>
            <pref-header type="dancer"></pref-header>
        </base-card>
        <base-card>
            <dancer-pref-info>
            </dancer-pref-info>
        </base-card>
        <div class="row justify-content-center">
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
    import {mapActions} from "vuex";
    export default {
        name: "DancerPrefs",
        components: {DancerPrefGroup, DancerPrefInfo, PrefHeader, BaseCard},
        methods: {
            ...mapActions('dancer_prefs', ['loadAllData', 'inializeData'])
        },
        created() {
            this.loadAllData().then(() => {
                this.inializeData();
            });
        }
    }
</script>

<style scoped>

</style>
