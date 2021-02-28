<template>
    <div class="row justify-content-between">
        <div class="col-auto">
            <base-button @click="changePref({type: 'previous'})">&larr; Previous {{ jumpField }}</base-button>
        </div>
        <div class="col-auto">
            <label for="pieceOptions" class="form-label">Jump to {{ jumpField }}</label>
            <input class="form-control" list="pieceOptions" v-model="jump_name" @input="changePref({type: 'jump', to: jump_name})"/>
            <datalist id="pieceOptions">
                <option v-for="option in options" :key="'filter-' + option" :value="option">{{ option }}</option>
            </datalist>
        </div>
        <div class="col-auto">
            <base-button @click="changePref({type: 'next'})">Next {{ jumpField }} &rarr;</base-button>
        </div>
    </div>
</template>

<script>
    import BaseButton from "../UI/BaseButton";
    import {mapActions, mapGetters} from 'vuex';
    export default {
        name: "PrefHeader",
        components: {BaseButton},
        props: ['type'],
        data() {
            return {
                jump_name: ''
            }
        },
        computed: {
            ...mapGetters('choreographer_prefs', ['pieces']),
            ...mapGetters('dancer_prefs', ['dancers']),
            options() {
                if (this.type === 'choreographer') {
                    return this.pieces;
                } else if (this.type === 'dancer') {
                    return this.dancers;
                }
                return [];
            },
            jumpField() {
                if (this.type === 'choreographer') {
                    return 'Piece';
                } else if (this.type === 'dancer') {
                    return 'Dancer';
                }
                return '';
            }
        },
        methods: {
            ...mapActions('choreographer_prefs', ['changeChoreographerPref']),
            ...mapActions('dancer_prefs', ['changeDancerPref']),
            changePref(payload) {
                this.jump_name = '';
                if (this.type === 'choreographer') {
                    this.changeChoreographerPref(payload);
                } else if (this.type === 'dancer') {
                    this.changeDancerPref(payload);
                }
            }
        }
    }
</script>

<style scoped>

</style>
