<template>
<!--    <h2>In Progress Show Order</h2>-->
    <div>
        <div class="card">
            <ul class="list-group list-group-flush" >
                <li v-for="(piece, index) in currentShowOrder" :key="piece"
                    class="list-group-item list-group-item d-flex
                           justify-content-between align-items-center shorten-dance-name"
                    :class="{'list-group-item-primary': selectedSlot === index,
                             'list-group-item-dark': piece === 'INTERMISSION',
                             'cursor': piece !== 'INTERMISSION'}"
                    @click="seeOptions({index: index})">
                    <div class="shorten-dance-name">
                        <base-badge color="blue" :title="getNumber(index)" :clickable="false"
                                    :class="{'smartOption': smartOptions.includes(piece)}"
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
        name: "InProgressShowOrder",
        components: {BaseBadge},
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters('show_order', ['currentShowOrder', 'selectedSlot', 'smartOptions'])
        },
        methods: {
            getNumber(index) {
                return parseInt(index, 10) <= 15 ? parseInt(index, 10) + 1 : parseInt(index, 10);
            },
            ...mapActions('show_order', ['seeOptions'])
        },
        created() {
            this.seeOptions({index: 0, dry_run: false})
        }
    }
</script>

<style scoped>
    .smartOption {
        border: 3px solid #ffcd08;
    }
</style>
