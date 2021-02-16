<template>
    <h2>Options for Show Order</h2>
    <base-button @click="smartSuggest" v-if="availableOptions.length === 0 && selectedIndex !== null">Suggest Swap</base-button>
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
            ...mapGetters('show_order', ['pieces', 'currentShowOrder', 'availableOptions', 'takenOptions', 'smartOptions', 'selectedIndex'])
        },
        methods: {
            ...mapActions(['loadData']),
            ...mapActions('show_order', ['addToShowOrder', 'smartSuggest'])
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
