<template>
    <ul class="list-group list my--3">
        <li class="list-group-item" :class="castStatusClass" v-if="showPiece">
            <base-badge :title="index" color="blue" :clickable="false" class="float-start"></base-badge>
            {{ piece }}
            <base-badge :title="currentStatus.rank" :color="statusBadgeColor" v-if="showStatusBadge" class="float-end"></base-badge>
        </li>
    </ul>
</template>

<script>
    import BaseBadge from "../../../UI/BaseBadge";
    export default {
        name: "CalendarItem",
        components: {BaseBadge},
        props: ['piece']
    }
</script>

<style scoped>

</style>
