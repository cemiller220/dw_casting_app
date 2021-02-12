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
        <div class="col">
            <base-card>
                <quick-changes></quick-changes>
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
    import QuickChanges from "../components/show_order/QuickChanges";
    import BaseButton from "../components/UI/BaseButton";

    export default {
        name: "ViewShowOrder",
        components: {BaseButton, QuickChanges, ShowOrderHeader, ShowOrder, BaseCard},
    }
</script>

<style scoped>

</style>
