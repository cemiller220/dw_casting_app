<template>
    <li class="list-group-item" :class="castStatusClass" v-if="showPiece">
        <base-badge :title="index" color="blue" :clickable="false" class="float-start"></base-badge>
        {{ piece }}
<!--        <base-badge :title="currentStatuses[piece].rank" :color="statusBadgeColor" v-if="showStatusBadge" class="float-end"></base-badge>-->
    </li>
</template>

<script>
    import BaseBadge from "../../UI/BaseBadge";
    export default {
        name: "DancerPrefItem",
        components: {BaseBadge},
        props: ['index', 'piece', 'currentStatuses'],
        computed: {
            castStatusClass() {
                // if (this.currentStatuses[this.piece].status === 'cast') {
                //     return 'list-group-item-success'
                // } else if (this.currentStatuses[this.piece].status === 'waitlist') {
                //     return 'list-group-item-secondary'
                // }
                return '';
            },
            showPiece() {
                return true;
            },
            statusBadgeColor() {
                if (this.currentStatuses[this.piece].preference === 'favorite') {
                    return 'green'
                }
                return '';
            },
            showStatusBadge() {
                return this.currentStatuses[this.piece].status !== 'not_preffed'
            }
        }
    }
</script>

<style scoped>

</style>
