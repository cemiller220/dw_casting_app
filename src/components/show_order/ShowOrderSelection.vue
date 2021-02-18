<template>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h3>Choose a Saved Show Order</h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-auto show-order-card text-center" v-for="(show_order, index) in showOrderOptions" :key="'show_order' + index">
            <base-card :clickable="true" @click="selectOption({index: index})">
                <h5>Option {{ index+1 }}</h5>
                <div class="box">
                    <p class="show-order-detail">Show Opener: <br><base-badge :title="show_order.showOrder[0]" :clickable="false"></base-badge></p>
                    <p class="show-order-detail">Act 1 Finale: <br><base-badge :title="show_order.showOrder[14]" :clickable="false"></base-badge></p>
                    <p class="show-order-detail">Act 2 Opener: <br><base-badge :title="show_order.showOrder[16]" :clickable="false"></base-badge></p>
                    <p class="show-order-detail">Act 2 Finale: <br><base-badge :title="show_order.showOrder[29]" :clickable="false"></base-badge></p>
                </div>
                <div class="box">
                    <p class="show-order-detail">Quick Change Score: <base-badge :title="show_order.stats.quick_change_score" :clickable="false"></base-badge></p>
                    <p class="show-order-detail">Back to Back:
                        <base-badge :title="show_order.stats.any_back_to_back ? 'yes' : 'no'"
                                    :color="show_order.stats.any_back_to_back ? 'red' : ''"
                                    :clickable="false"></base-badge>
                    </p>
                </div>
            </base-card>
        </div>
    </div>
</template>

<script>
    import BaseCard from "../UI/BaseCard";
    import BaseBadge from "../UI/BaseBadge";
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: "ShowOrderSelection",
        components: {BaseBadge, BaseCard},
        computed: {
            ...mapGetters('show_order', ['showOrderOptions'])
        },
        methods: {
            ...mapActions('show_order', ['selectOption'])
        }
    }
</script>

<style scoped>
    .show-order-card {
        width: 300px;
    }

    .box {
        border: 1px solid black;
        border-radius: 12px;
        margin: 10px;
    }

    .show-order-detail {
        margin-top: 1rem;
        margin-left: 0.5rem;
    }
</style>
