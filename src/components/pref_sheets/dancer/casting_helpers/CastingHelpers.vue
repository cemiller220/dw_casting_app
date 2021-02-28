<template>
        <li class="list-group-item text-center">
            <base-badge title="Add" :clickable="true" color="green"></base-badge>
            <base-badge title="Drop" :clickable="true" color="red"></base-badge>
        </li>
</template>

<script>
    import BaseBadge from "../../../UI/BaseBadge";
    export default {
        name: "CastingHelpers",
        components: {BaseBadge}
    }
</script>

<style scoped>

</style>
