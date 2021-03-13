<template>
    <div v-if="currentPref.prefs && currentCastStatuses">
        <div class="card special-card-styles">
            <div class="card-header text-center">
                <h5 class="h3 mb-0">{{ type }}</h5>
            </div>
            <div class="card-body text-center">
                <ul class="list-group list my--3">
                    <choreographer-pref-item v-for="(dancer, index) in currentPref.prefs[type.toLowerCase()]" :key="dancer"
                                             :dancer="dancer"
                                             :index="index+startingIndex"
                                             :status="currentCastStatuses[dancer]">
                    </choreographer-pref-item>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import ChoreographerPrefItem from "./ChoreographerPrefItem";
    import {mapGetters} from 'vuex';

    export default {
        name: "ChoreographerPrefGroup",
        components: {ChoreographerPrefItem},
        props: ['type'],
        computed: {
            ...mapGetters('prefs', ['currentPref', 'currentCastStatuses']),
            ...mapGetters('cast_list', ['castList']),
            startingIndex() {
                return this.type === 'Favorites'? 1 : this.currentPref.prefs.favorites.length+1;
            },
            currentPiece() {
                if (this.currentPref) {
                    return this.currentPref.name;
                }
                return '';
            }
        }
    }
</script>

<style scoped>

</style>
