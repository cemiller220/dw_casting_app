<template>
    <base-card>
        <show-order-header></show-order-header>
    </base-card>
    <base-card style="margin-top: 20px;" v-if="view === 'all'">
        <show-order-selection></show-order-selection>
    </base-card>
    <div class="row justify-content-around" v-if="view !== 'all'">
        <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
            <base-card>
                <show-order></show-order>
            </base-card>
        </div>
        <div class="col" :style="'margin-top: ' + marginCalc ">
            <base-card>
                <component :is="rightComponent"></component>
            </base-card>
        </div>
    </div>
    <div class="row">
        <div class="col-auto">
            <base-button @click="resetShowOrder">Reset to Real Show Order</base-button>
        </div>
    </div>
</template>

<script>
    import BaseCard from "../components/UI/BaseCard";
    import ShowOrder from "../components/show_order/ShowOrder";
    import ShowOrderHeader from "../components/show_order/ShowOrderHeader";
    import OptionsForShowOrder from "../components/show_order/OptionsForShowOrder";
    import QuickChanges from "../components/show_order/QuickChanges";
    import BaseButton from "../components/UI/BaseButton";
    import {mapActions, mapGetters} from "vuex";
    import AllowedNext from "../components/show_order/AllowedNext";
    import ShowOrderSelection from "../components/show_order/ShowOrderSelection";

    export default {
        name: "ViewShowOrder",
        components: {ShowOrderSelection, AllowedNext, BaseButton, QuickChanges, ShowOrderHeader, ShowOrder, BaseCard, OptionsForShowOrder},
        computed: {
            ...mapGetters('show_order', ['dancerOverlap', 'view', 'selectedIndex']),
            rightComponent() {
                return this.view === 'main' ? 'quick-changes' : 'options-for-show-order';
            },
            marginCalc() {
                const stopping_index = this.view === 'main' ? 18 : 20;
                return 45*(this.selectedIndex <= stopping_index ? this.selectedIndex : stopping_index) + 'px';
            }
        },
        methods: {
            ...mapActions(['calculateData']),
            ...mapActions('show_order', ['resetShowOrder'])
        },
        created() {
            console.log('view: ' + this.view);
            this.calculateData({
                functionName: 'show_order',
                keyMutationPairs: {dancer_overlap: 'show_order/setDancerOverlap', allowed_next: 'show_order/setAllowedNext', all_show_orders: 'show_order/setAllShowOrders'},
                force: true
            })
        }
    }
</script>

<style scoped>

</style>
