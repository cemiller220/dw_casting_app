<template>
    <!-- QUICK CHANGES -->
    <div class="row justify-content-center">
        <div class="col-auto">
            <h2>Quick Changes</h2>
        </div>
    </div>
    <div v-if="show_quick_changes">
        <quick-change-info key-name="into"></quick-change-info>
        <quick-change-info key-name="after"></quick-change-info>
    </div>
    <div class="row justify-content-center" v-else>
        <div class="col-auto">
            <p>Click a dance to view quick changes</p>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import QuickChangeInfo from "./QuickChangeInfo";

    export default {
        name: "QuickChanges",
        components: {QuickChangeInfo},
        computed: {
            ...mapGetters('show_order', ['selectedPieceIndex']),
            show_quick_changes() {
                return this.selectedPieceIndex !== null;
            }
        }
    }
</script>

<style scoped>

</style>


