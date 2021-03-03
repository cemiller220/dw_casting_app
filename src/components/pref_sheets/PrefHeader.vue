<template>
    <div class="row justify-content-between">
        <div class="col-auto">
            <base-button @click="changePrefClick({type: 'previous'})">&larr; Previous {{ jumpField }}</base-button>
        </div>
        <div class="col-auto">
            <label for="pieceOptions" class="form-label">Jump to {{ jumpField }}</label>
            <input class="form-control" list="pieceOptions" v-model="jump_name" @input="changePrefClick({type: 'jump', to: jump_name})"/>
            <datalist id="pieceOptions">
                <option v-for="option in options" :key="'filter-' + option" :value="option">{{ option }}</option>
            </datalist>
        </div>
        <div class="col-auto">
            <base-button @click="changePrefClick({type: 'next'})">Next {{ jumpField }} &rarr;</base-button>
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
            ...mapGetters('prefs', ['dancers', 'pieces']),
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
            ...mapActions('prefs', ['changePref']),
            changePrefClick(payload) {
                // this.jump_name = '';
                this.changePref(payload);
            }
        }
    }
</script>

<style scoped>

</style>
