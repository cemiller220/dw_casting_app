<template>
    <div>
        <div class="card special-card-styles">
            <div class="card-header text-center">
                <h5 class="h3 mb-0">{{ type }}</h5>
            </div>
            <div class="card-body text-center">
                <ul class="list-group list my--3">
                    <choreographer-pref-item v-for="(dancer, index) in prefs" :key="dancer"
                                             :dancer="dancer"
                                             :index="index+starting_index" :current_cast="current_cast">
                    </choreographer-pref-item>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

    import ChoreographerPrefItem from "./ChoreographerPrefItem";
    export default {
        name: "ChoreographerPrefGroup",
        components: {ChoreographerPrefItem},
        props: ['type', 'prefs', 'starting_index', 'current_cast'],
    }
</script>

<style scoped>

</style>
