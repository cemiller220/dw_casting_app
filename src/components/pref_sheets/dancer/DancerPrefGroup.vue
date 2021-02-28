<template>
    <div v-if="currentPref.prefs && currentStatuses">
        <div class="card special-card-styles">
            <div class="card-header text-center">
                <h5 class="h3 mb-0">Preferences</h5>
            </div>
            <div class="card-body">
                <ul class="list-group list my--3">
                    <dancer-pref-item v-for="(piece, index) in currentPref.prefs" :key="piece"
                                      :piece="piece"
                                      :index="index"
                                      :currentStatus="currentStatuses[piece]">
                    </dancer-pref-item>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import DancerPrefItem from "./DancerPrefItem";
    import {mapGetters} from "vuex";
    export default {
        name: "DancerPrefGroup",
        components: {DancerPrefItem},
        computed: {
            ...mapGetters('prefs', ['currentPref', 'currentStatuses'])
        }
    }
</script>

<style scoped>

</style>
