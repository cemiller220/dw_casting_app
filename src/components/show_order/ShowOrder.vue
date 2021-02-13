<template>
    <div class="scroll margin-border" v-if="showOrderExists">
        <div class="card">
            <ul class="list-group list-group-flush" @keyup='nextItem'>
                <li v-for="(piece, index) in showOrder" :key="index"
                    :id="'element' + index"
                    class="list-group-item list-group-item d-flex
                           justify-content-between align-items-center shorten-dance-name"
                    :class="{'list-group-item-primary': selectedPiece === piece,
                             'list-group-item-dark': piece === 'INTERMISSION',
                             'cursor': piece !== 'INTERMISSION'}"
                    @click="selectPiece({piece: piece})">
                    <div class="shorten-dance-name">
                        <base-badge color="blue" :title="getNumber(index)" :clickable="false"
                                    v-if="piece !== 'INTERMISSION' ">
                        </base-badge>
                        {{ piece }}
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import BaseBadge from "../UI/BaseBadge";
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: "ShowOrder",
        components: {BaseBadge},
        data() {
            return {}
        },
        computed: {
            ...mapGetters('show_order', ['showOrder', 'showOrderExists', 'selectedPiece'])
        },
        methods: {
            ...mapActions('show_order', ['selectPiece']),
            getNumber(index) {
                return parseInt(index, 10) <= 15 ? parseInt(index, 10) + 1 : parseInt(index, 10);
            }
        }
    }
</script>

<style scoped>

</style>
