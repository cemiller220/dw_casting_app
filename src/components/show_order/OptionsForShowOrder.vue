<template>
    <h2>Options for Show Order</h2>
    <div class="row">
        <div class="col-auto">
            <base-button @click="smartSuggest" v-if="showSmartSuggest">Suggest From Taken</base-button>
            <base-button @click="swapSuggest" v-if="selectedIndex !== null && showOrder[selectedIndex] !== ''">Suggest Swap</base-button>
        </div>

    </div>
    <div class="row">
        <div class="col-auto optionBadges" v-for="piece in availableOptions" :key="piece">
            <base-badge :title="piece" :clickable="true" color="blue"
                        @click="addToShowOrder({piece: piece})"
                        :class="{'smartOption': smartOptions.includes(piece)}">
            </base-badge>
        </div>
    </div>
    <div class="row">
        <div class="col-auto optionBadges" v-for="piece in takenOptions" :key="piece">
            <base-badge :title="piece" :clickable="true"
                        @click="addToShowOrder({piece: piece})"
                        :class="{'smartOption': smartOptions.includes(piece)}">
            </base-badge>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import BaseBadge from "../UI/BaseBadge";
    import BaseButton from "../UI/BaseButton";
    export default {
        name: "OptionsForShowOrder",
        components: {BaseButton, BaseBadge},
        computed: {
            ...mapGetters(['pieces']),
            ...mapGetters('show_order', ['showOrder', 'availableOptions', 'takenOptions', 'smartOptions', 'selectedIndex']),
            showSmartSuggest() {
                return this.availableOptions.length === 0 && this.selectedIndex !== null && this.showOrder.indexOf('') !== -1
            }
        },
        methods: {
            ...mapActions(['loadData']),
            ...mapActions('show_order', ['addToShowOrder', 'smartSuggest', 'swapSuggest'])
        }
    }
</script>

<style scoped>
    .optionBadges {
        margin: 0.5rem 0;
    }

    .smartOption {
        border: 3px solid #ffcd08;
    }
</style>
