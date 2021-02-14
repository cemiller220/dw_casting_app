<template>
    <base-card>
        <show-order-header></show-order-header>
    </base-card>
    <div class="row justify-content-around">
        <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
            <base-card>
                <component :is="leftComponent"></component>
            </base-card>
        </div>
        <div class="col">
            <base-card>
                <component :is="rightComponent"></component>
            </base-card>
        </div>
    </div>
    <div class="row">
        <div class="col-auto">
            <base-button>Reset Show Order</base-button>
        </div>
    </div>
</template>

<script>
    import BaseCard from "../components/UI/BaseCard";
    import ShowOrder from "../components/show_order/ShowOrder";
    import ShowOrderHeader from "../components/show_order/ShowOrderHeader";
    import InProgressShowOrder from "../components/show_order/InProgressShowOrder";
    import OptionsForShowOrder from "../components/show_order/OptionsForShowOrder";
    import QuickChanges from "../components/show_order/QuickChanges";
    import BaseButton from "../components/UI/BaseButton";
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "ViewShowOrder",
        components: {BaseButton, QuickChanges, ShowOrderHeader, ShowOrder, BaseCard, InProgressShowOrder, OptionsForShowOrder},
        computed: {
            ...mapGetters('show_order', ['dancerOverlap', 'showOrderExists']),
            leftComponent() {
                return this.showOrderExists ? 'show-order' : 'in-progress-show-order';
            },
            rightComponent() {
                return this.showOrderExists ? 'quick-changes' : 'options-for-show-order';
            }
        },
        methods: {
            ...mapActions(['loadData']),
            ...mapActions('show_order', ['calculateQuickChanges'])
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
