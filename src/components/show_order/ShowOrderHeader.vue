<template>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h1>Show Order</h1>
        </div>
    </div>
    <div class="row justify-content-center" v-if="view === 'all'">
        <div class="col-auto">
            <base-button @click="newShowOrder">New Show Order</base-button>
            <base-button @click="calculateQuickChanges">Refresh Quick Changes</base-button>
        </div>
    </div>
    <div class="row justify-content-center" v-if="view === 'main'">
        <div class="col-auto">
            <base-button @click="newShowOrder">New Show Order</base-button>
            <base-button @click="editShowOrder">Edit Show Order</base-button>
            <base-button @click="deleteShowOrder">Delete Show Order</base-button>
        </div>
    </div>
    <div class="row justify-content-center" v-if="view === 'main'">
        <div class="col-auto">
            <base-button @click="viewAllShowOrders">View All Show Orders</base-button>
            <base-button @click="calculateQuickChanges">Refresh Quick Changes</base-button>
        </div>
    </div>
    <div class="row justify-content-center" v-if="view === 'edit'">
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
            ...mapGetters('show_order', ['view', 'showOrder'])
        },
        methods: {
            ...mapActions(['calculateData']),
            ...mapActions('show_order', ['saveShowOrder', 'newShowOrder',
                'editShowOrder', 'deleteShowOrder', 'viewAllShowOrders']),
            calculateQuickChanges() {
                this.calculateData({
                    functionName: 'show_order',
                    keyMutationPairs: {dancer_overlap: 'show_order/setDancerOverlap', allowed_next: 'show_order/setAllowedNext', all_show_orders: 'show_order/setAllShowOrders'},
                    force: true
                })
            }
        }
    }
</script>

<style scoped>

</style>
