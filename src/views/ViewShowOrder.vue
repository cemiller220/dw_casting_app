<template>
    <base-card>
        <show-order-header></show-order-header>
    </base-card>
<!--    <div class="row" v-if="!showOrderExists">-->
<!--        <div class="col">-->
<!--            <base-card>-->
<!--                <allowed-next></allowed-next>-->
<!--            </base-card>-->
<!--        </div>-->
<!--    </div>-->
    <div class="row justify-content-around">
        <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">
            <base-card>
                <component :is="leftComponent"></component>
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
    import AllowedNext from "../components/show_order/AllowedNext";

    export default {
        name: "ViewShowOrder",
        components: {AllowedNext, BaseButton, QuickChanges, ShowOrderHeader, ShowOrder, BaseCard, InProgressShowOrder, OptionsForShowOrder},
        data() {
            return {
                // marginCalc: 0
            }
        },
        computed: {
            ...mapGetters('show_order', ['dancerOverlap', 'showOrderExists', 'selectedSlot', 'selectedPieceIndex']),
            leftComponent() {
                return this.showOrderExists ? 'show-order' : 'in-progress-show-order';
            },
            rightComponent() {
                return this.showOrderExists ? 'quick-changes' : 'options-for-show-order';
            },
            marginCalc() {
                if (this.showOrderExists) {
                    return 45*(this.selectedPieceIndex <= 18 ? this.selectedPieceIndex : 18) + 'px';
                } else {
                    return 45*(this.selectedSlot <= 20 ? this.selectedSlot : 20) + 'px';
                }
            }
        },
        methods: {
            ...mapActions(['loadData']),
            ...mapActions('show_order', ['calculateQuickChanges'])
        },
        // watch: {
        //     selectedSlot() {
        //         this.marginCalc = 45*(this.selectedSlot <= 20 ? this.selectedSlot : 20) + 'px';
        //     },
        //     selectedPieceIndex() {
        //         this.marginCalc = 45*(this.selectedPieceIndex <= 18 ? this.selectedPieceIndex : 18) + 'px';
        //     }
        // },
        created() {
            this.loadData({node: 'show_order', mutation: 'show_order/setShowOrder'});
            this.loadData({node: 'pieces', mutation: 'show_order/setPieces'});
            this.calculateQuickChanges({force: false});
        }
    }
</script>

<style scoped>

</style>
