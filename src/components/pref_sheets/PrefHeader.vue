<template>
    <div class="row justify-content-between">
        <div class="col-auto">
            <base-button @click="changePrefClick({change_direction: 'previous'})">&larr; Previous {{ jumpField }}</base-button>
        </div>
        <div class="col-auto">
            <label for="pieceOptions" class="form-label">Jump to {{ jumpField }}</label>
            <input class="form-control" list="pieceOptions" v-model="jump_name" @input="changePrefClick({change_direction: 'jump', to: jump_name})"/>
            <datalist id="pieceOptions">
                <option v-for="option in options" :key="'filter-' + option" :value="option">{{ option }}</option>
            </datalist>
        </div>
        <div class="col-auto">
            <base-button @click="changePrefClick({change_direction: 'next'})">Next {{ jumpField }} &rarr;</base-button>
        </div>
    </div>
</template>

<script>
    import BaseButton from "../UI/BaseButton";
    import {mapActions, mapGetters} from 'vuex';
    export default {
        name: "PrefHeader",
        components: {BaseButton},
        props: ['type', 'page'],
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
            ...mapActions('run_casting', ['calculateThenInitialize']),
            changePrefClick(payload) {
                if (this.page === 'prefs') {
                    this.changePref(payload);
                } else {
                    this.calculateThenInitialize({
                        ...payload,
                        functionName: 'keep_drop'
                    })
                }

            }
        }
    }
</script>

<style scoped>

</style>
