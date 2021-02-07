<template>
    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 justify-content-center">
        <div class="card special-card-styles">
            <div class="card-header text-center">
                <h5 class="h3 mb-0">{{ dance.name }}</h5>
                <p>{{ dance.choreographer }}<br>{{ dance.time.day }} {{ dance.time.time }}pm</p>
            </div>
            <div class="card-body">
                <ul class="list-group list my--3">
                    <cast-list-item v-for="dancer in dance.cast"
                                    :dancer="dancer"
                                    :piece="dance.name"
                                    :key="dance.name + dancer.name">
                    </cast-list-item>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import CastListItem from "./CastListItem";
    export default {
        name: "CastListGroup",
        components: {CastListItem},
        props: ['dance']
    }
</script>

<style scoped>
    .special-card-styles {
        border: 1px solid #13002b;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    }
</style>
