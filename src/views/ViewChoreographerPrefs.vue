<template>
    <div v-if="currentPref && castList">
        <base-card>
            <pref-header :pieces="pieces"></pref-header>
        </base-card>
        <base-card>
            <choreographer-pref-info
                    :name="currentPref.name"
                    :choreographer="currentPref.choreographer">
            </choreographer-pref-info>
        </base-card>
        <div class="row justify-content-center">
            <div class="col-6">
                <base-card>
                    <choreographer-pref-group type="Favorites"
                                              :prefs="currentPref.prefs.favorites"
                                              :starting_index="1"
                                              :current_cast="currentCast">
                    </choreographer-pref-group>
                </base-card>
            </div>
            <div class="col-6">
                <base-card>
                    <choreographer-pref-group type="Alternates"
                                              :prefs="currentPref.prefs.alternates"
                                              :starting_index="currentPref.prefs.favorites.length+1"
                                              :current_cast="currentCast">
                    </choreographer-pref-group>
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
    import {mapActions, mapGetters} from 'vuex';
    export default {
        name: "ChoreographerPrefs",
        components: {ChoreographerPrefGroup, ChoreographerPrefInfo, BaseCard, PrefHeader},
        computed: {
            ...mapGetters('choreographer_prefs', ['pieces', 'prefsAll', 'currentIndex']),
            ...mapGetters('cast_list', ['castList']),
            currentPref() {
                return this.prefsAll[this.currentIndex]
            },
            currentCast() {
                return this.castList.filter(piece => piece.name === this.currentPref.name)[0];
            }
        },
        methods: {
            ...mapActions(['loadData']),
        },
        created() {
            this.loadData({node: 'choreographer_prefs', mutation: 'choreographer_prefs/setPrefsAll'});
            this.loadData({node: 'cast_list', mutation: 'cast_list/setCastList'});
        }
    }
</script>

<style scoped>

</style>
