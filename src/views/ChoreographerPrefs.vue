<template>
    <div>
        <base-card>
            <pref-header :pieces="pieces"></pref-header>
        </base-card>
        <base-card>
            <choreographer-pref-info
                    :name="currentPref.name"
                    :choreographer="currentPref.choreographer"
                    :showDrop="true">
            </choreographer-pref-info>
        </base-card>
        <div class="row justify-content-center">
            <div class="col-6">
                <base-card>
                    <choreographer-pref-group type="Favorites" :prefs="currentPref.prefs.favorites" :starting_index="1"></choreographer-pref-group>
                </base-card>
            </div>
            <div class="col-6">
                <base-card>
                    <choreographer-pref-group type="Alternates" :prefs="currentPref.prefs.alternates" :starting_index="currentPref.prefs.favorites.length+1"></choreographer-pref-group>
                </base-card>
            </div>
        </div>
    </div>
</template>

<script>
    import PrefHeader from "../components/pref_sheets/PrefHeader";
    import BaseCard from "../components/UI/BaseCard";
    import ChoreographerPrefInfo from "../components/pref_sheets/choreographer/ChoreographerPrefInfo";
    import ChoreographerPrefGroup from "../components/pref_sheets/choreographer/ChoreographerPrefGroup";
    import {mapGetters} from 'vuex';
    export default {
        name: "ChoreographerPrefs",
        components: {ChoreographerPrefGroup, ChoreographerPrefInfo, BaseCard, PrefHeader},
        computed: {
            ...mapGetters('choreographer_prefs', ['pieces', 'prefsAll', 'currentIndex']),
            currentPref() {
                return this.prefsAll[this.currentIndex]
            },
        },
        created() {
            console.log(this.pieces);
            console.log(this.currentPref);
        }
    }
</script>

<style scoped>

</style>
