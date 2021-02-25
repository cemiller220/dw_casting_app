<template>
    <div class="row justify-content-between">
        <div class="col-auto">
            <base-button @click="changePref({type: 'previous'})">&larr; Previous Dance</base-button>
        </div>
        <div class="col-auto">
            <label for="pieceOptions" class="form-label">Jump to Piece</label>
            <input class="form-control" list="pieceOptions" v-model="jump_dance_name" @input="changePref({type: 'jump', piece: jump_dance_name})"/>
            <datalist id="pieceOptions">
                <option v-for="piece in pieces" :key="'pieceFilter-' + piece" :value="piece">{{ piece }}</option>
            </datalist>
        </div>
        <div class="col-auto">
            <base-button @click="changePref({type: 'next'})">Next Dance &rarr;</base-button>
        </div>
    </div>
</template>

<script>
    import BaseButton from "../UI/BaseButton";
    import {mapActions, mapGetters} from 'vuex';
    export default {
        name: "PrefHeader",
        components: {BaseButton},
        data() {
            return {
                jump_dance_name: ''
            }
        },
        computed: {
            ...mapGetters('choreographer_prefs', ['pieces'])
        },
        methods: {
            ...mapActions('choreographer_prefs', ['changePref'])
        }
    }
</script>

<style scoped>

</style>
