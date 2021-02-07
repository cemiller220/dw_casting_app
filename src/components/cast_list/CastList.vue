<template>
    <div class="row justify-content-center" v-if="filteredCastList.length === 0">
        <div class="col-auto">
            <h5>No Cast List Found</h5>
        </div>
    </div>
    <div class="row justify-content-center" v-else>
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
