<template>
    <h2>Options for Show Order</h2>
    <div class="row">
        <div class="col-auto" v-for="piece in filteredPieces" :key="piece" style="margin: 0.5rem 0">
            <base-badge :title="piece" :clickable="true" @click="addToShowOrder({piece: piece})"></base-badge>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import BaseBadge from "../UI/BaseBadge";
    export default {
        name: "OptionsForShowOrder",
        components: {BaseBadge},
        computed: {
            ...mapGetters('show_order', ['pieces', 'currentShowOrder']),
            filteredPieces() {
                return this.pieces.filter(piece => this.currentShowOrder.indexOf(piece) === -1)
            }
        },
        methods: {
            ...mapActions(['loadData']),
            ...mapActions('show_order', ['addToShowOrder'])
        }
    }
</script>

<style scoped>

</style>
