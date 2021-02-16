<template>
    <base-card>
        <show-order-header></show-order-header>
    </base-card>
    <div class="row justify-content-around">
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
            <base-button @click="resetAll">Reset to Real Show Order</base-button>
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

    export default {
        name: "ViewShowOrder",
        components: {AllowedNext, BaseButton, QuickChanges, ShowOrderHeader, ShowOrder, BaseCard, OptionsForShowOrder},
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
            ...mapActions(['loadData']),
            ...mapActions('show_order', ['calculateQuickChanges', 'resetAll'])
        },
        created() {
            this.loadData({node: 'show_order', mutation: 'show_order/setShowOrder'});
            this.loadData({node: 'pieces', mutation: 'show_order/setPieces'});
            this.calculateQuickChanges({force: false});
        }
    }
</script>

<style scoped>

</style>
