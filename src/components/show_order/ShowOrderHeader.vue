<template>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h1>Show Order</h1>
        </div>
    </div>
    <div class="row justify-content-center" v-if="showOrderExists">
        <div class="col-auto">
            <base-button @click="newShowOrder">New Show Order</base-button>
            <base-button @click="editShowOrder">Edit Show Order</base-button>
            <base-button @click="calculateQuickChanges({force: true})">Refresh Quick Changes</base-button>
        </div>
    </div>
    <div class="row justify-content-center" v-if="showOrderDone && !showOrderExists">
        <div class="col-auto">
            <base-button @click="saveShowOrder">Save Show Order</base-button>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";
    import BaseButton from "../UI/BaseButton";

    export default {
        name: "ShowOrderHeader",
        components: {BaseButton},
        computed: {
            ...mapGetters('show_order', ['showOrderExists', 'currentShowOrder']),
            showOrderDone() {
                return this.currentShowOrder.indexOf('') === -1;
            }
        },
        methods: {
            ...mapActions('show_order', ['saveShowOrder', 'newShowOrder', 'calculateQuickChanges', 'editShowOrder'])
        }
    }
</script>

<style scoped>

</style>
