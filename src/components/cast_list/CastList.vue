<template>
    <div class="row justify-content-center">
        <cast-list-group v-for="dance in filteredCastList" :key="dance.name" class="dance-card"
                         :dance="dance">
        </cast-list-group>
    </div>
</template>

<script>
    import CastListGroup from "./CastListGroup";

    export default {
        name: "CastList",
        props: ['filteredCastList'],
        components: {
            CastListGroup
        },
    }
</script>

<style scoped>
    .dance-card {
        padding: 12px;
    }
</style>
