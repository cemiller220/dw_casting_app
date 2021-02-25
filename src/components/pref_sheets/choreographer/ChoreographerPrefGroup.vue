<template>
    <div v-if="currentPref.prefs">
        <div class="card special-card-styles">
            <div class="card-header text-center">
                <h5 class="h3 mb-0">{{ type }}</h5>
            </div>
            <div class="card-body text-center">
                <ul class="list-group list my--3">
                    <choreographer-pref-item v-for="(dancer, index) in currentPref.prefs[type.toLowerCase()]" :key="dancer"
                                             :dancer="dancer"
                                             :index="index+startingIndex"
                                             :currentCast="currentCast">
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
            ...mapGetters('choreographer_prefs', ['currentPref', 'currentPiece']),
            ...mapGetters('cast_list', ['castList']),
            startingIndex() {
                return this.type === 'Favorites'? 1 : this.currentPref.prefs.favorites.length+1;
            },
            currentCast() {
                if (this.castList.length !== 0 && this.castList.filter(piece => piece.name === this.currentPiece).length !== 0) {
                    return this.castList.filter(piece => piece.name === this.currentPiece)[0].cast
                }
                return null;
            },
        }
    }
</script>

<style scoped>

</style>
