<template>
    <div>
        <div class="card" tabindex="0"
             @keyup.down="incrementIndex({value: 1})"
             @keyup.up="incrementIndex({value: -1})">
            <ul class="list-group list-group-flush">
                <li v-for="(piece, index) in showOrder" :key="index"
                    class="list-group-item list-group-item d-flex
                           justify-content-between align-items-center shorten-dance-name"
                    :class="{'list-group-item-primary': selectedIndex === index,
                             'list-group-item-dark': piece === 'INTERMISSION',
                             'cursor': piece !== 'INTERMISSION'}"
                    @click="clickItem(index)">
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
        name: "ShowOrder",
        components: {BaseBadge},
        computed: {
            ...mapGetters('show_order', ['showOrder', 'selectedIndex', 'smartOptions', 'view'])
        },
        methods: {
            ...mapActions('show_order', ['seeQuickChanges', 'seeOptions', 'incrementIndex']),
            getNumber(index) {
                return parseInt(index, 10) <= 15 ? parseInt(index, 10) + 1 : parseInt(index, 10);
            },
            clickItem(index) {
                if (this.view === 'main') {
                    this.seeQuickChanges({index: index})
                } else if (this.view === 'edit') {
                    this.seeOptions({index: index})
                }
            }
        }
    }
</script>

<style scoped>
    .smartOption {
        border: 3px solid #ffcd08;
    }
</style>
