<template>
    <div v-if="currentPref.prefs">
        <div class="card special-card-styles">
            <div class="card-header text-center">
                <h5 class="h3 mb-0">Preferences</h5>
            </div>
            <div class="card-body text-center">
                <ul class="list-group list my--3">
                    <dancer-pref-item v-for="(piece, index) in currentPref.prefs" :key="piece"
                                             :piece="piece"
                                             :index="index"
                                             :currentStatuses="currentStatuses">
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
        data() {
            return {
                currentPref: {prefs: ['dance1', 'dance2']},
                currentStatuses: {
                    dance1: {preference: 'favorite', status: 'cast', rank: 5},
                    dance2: {preference: 'alternate', status: 'waitlist', rank: 27},
                }
            }
        }
    }
</script>

<style scoped>

</style>
