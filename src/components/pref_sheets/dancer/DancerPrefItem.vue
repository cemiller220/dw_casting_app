<template>
    <li class="list-group-item" :class="castStatusClass" v-if="showPiece">
        <base-badge :title="index" color="blue" :clickable="false" class="float-start"></base-badge>
        {{ piece }}
        <base-badge :title="currentStatus.rank" :color="statusBadgeColor" v-if="showStatusBadge" class="float-end"></base-badge>
    </li>
</template>

<script>
    import BaseBadge from "../../UI/BaseBadge";
    export default {
        name: "DancerPrefItem",
        components: {BaseBadge},
        props: ['index', 'piece', 'currentStatus'],
        computed: {
            castStatusClass() {
                if (this.currentStatus) {
                    if (this.currentStatus.status === 'cast') {
                        return 'list-group-item-success'
                    } else if (this.currentStatus.status === 'waitlist') {
                        return 'list-group-item-secondary'
                    }
                }
                return '';
            },
            showPiece() {
                return true;
            },
            statusBadgeColor() {
                if (this.currentStatus) {
                    if (this.currentStatus.preference === 'favorite') {
                        return 'green'
                    }
                }
                return '';
            },
            showStatusBadge() {
                if (this.currentStatus) {
                    return this.currentStatus.preference !== 'not preffed'
                }
                return false;
            }
        }
    }
</script>

<style scoped>

</style>
