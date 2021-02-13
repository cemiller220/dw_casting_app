<template>
    <h2>In Progress Show Order</h2>
    <div class="scroll margin-border">
        <div class="card">
            <ul class="list-group list-group-flush">
                <li v-for="(piece, index) in currentShowOrder" :key="piece"
                    class="list-group-item list-group-item d-flex
                           justify-content-between align-items-center shorten-dance-name"
                    :class="{'list-group-item-primary': selectedSlot === index,
                             'list-group-item-dark': piece === 'INTERMISSION',
                             'cursor': piece !== 'INTERMISSION'}"
                    @click="seeOptions(index)">
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
    import { mapGetters } from 'vuex';

    export default {
        name: "InProgressShowOrder",
        components: {BaseBadge},
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters('show_order', ['currentShowOrder', 'selectedSlot'])
        },
        methods: {
            getNumber(index) {
                return parseInt(index, 10) <= 15 ? parseInt(index, 10) + 1 : parseInt(index, 10);
            },
            seeOptions(index) {
                return index;
            }
        }
    }
</script>

<style scoped>

</style>
