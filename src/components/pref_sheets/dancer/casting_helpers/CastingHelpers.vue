<template>
        <li class="list-group-item text-center">
            <base-badge title="Switch to Keep"
                        :clickable="true"
                        color="green"
                        v-if="keepDrop !== 'keep'"
                        @click="updateKeepDrop({piece: piece, value: 'keep'})">
            </base-badge>
            <base-badge title="Switch to Drop"
                        :clickable="true"
                        color="red"
                        v-if="keepDrop !== 'drop'"
                        @click="updateKeepDrop({piece: piece, value: 'drop'})">
            </base-badge>
        </li>
</template>

<script>
    import BaseBadge from "../../../UI/BaseBadge";
    import {mapActions} from 'vuex';

    export default {
        name: "CastingHelpers",
        components: {BaseBadge},
        props: ['keepDrop', 'piece'],
        methods: {
            ...mapActions('prefs', ['updateKeepDrop'])
        }
    }
</script>

<style scoped>

</style>
