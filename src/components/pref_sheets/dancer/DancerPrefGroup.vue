<template>
    <div v-if="currentPref.prefs && currentDancerStatuses">
        <div class="card special-card-styles">
            <div class="card-header text-center">
                <h5 class="h3 mb-0">Preferences</h5>
            </div>
            <div class="card-body">
                <ul class="list-group list my--3">
                    <dancer-pref-item v-for="(piece, index) in currentPref.prefs" :key="piece"
                                      :piece="piece"
                                      :index="index+1"
                                      :show-dropped="showDropped"
                                      :currentStatus="currentDancerStatuses[piece]"
                                      :keepDrop="keepDrop[piece]"
                                      :page="page">
                    </dancer-pref-item>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import DancerPrefItem from "./DancerPrefItem";

    export default {
        name: "DancerPrefGroup",
        components: {DancerPrefItem},
        props: ['page', 'keepDrop', 'currentPref', 'currentDancerStatuses', 'showDropped'],
    }
</script>

<style scoped>

</style>
