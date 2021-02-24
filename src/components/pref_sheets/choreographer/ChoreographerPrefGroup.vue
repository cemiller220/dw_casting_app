<template>
    <div>
        <div class="card special-card-styles">
            <div class="card-header text-center">
                <h5 class="h3 mb-0">{{ type }}</h5>
            </div>
            <div class="card-body text-center">
                <ul class="list-group list my--3">
                    <li class="list-group-item" v-for="(dancer, index) in prefs" :key="dancer">
                        <base-badge :title="index+starting_index" color="blue" :clickable="false"></base-badge>
                        {{ dancer }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import BaseBadge from "../../UI/BaseBadge";
    export default {
        name: "ChoreographerPrefGroup",
        components: {BaseBadge},
        props: ['type', 'prefs', 'starting_index']
    }
</script>

<style scoped>

</style>
