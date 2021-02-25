<template>
    <div>
        <base-card>
            <pref-header></pref-header>
        </base-card>
        <base-card>
            <choreographer-pref-info>
            </choreographer-pref-info>
        </base-card>
        <div class="row justify-content-center">
            <div class="col-6">
                <base-card>
                    <choreographer-pref-group type="Favorites">
                    </choreographer-pref-group>
                </base-card>
            </div>
            <div class="col-6">
                <base-card>
                    <choreographer-pref-group type="Alternates">
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
    import {mapActions} from 'vuex';
    export default {
        name: "ChoreographerPrefs",
        components: {ChoreographerPrefGroup, ChoreographerPrefInfo, BaseCard, PrefHeader},
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
