<template>
    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 justify-content-center">
        <div class="card special-card-styles">
            <div class="card-header text-center">
                <h5 class="h3 mb-0">{{ pieceName }}</h5>
                <p v-if="Object.keys(metadata).length !== 0 && metadata.times[pieceName]">
                    {{ metadata.choreographers[pieceName] }}
                    <br>
                    {{ metadata.times[pieceName].day }} {{ metadata.times[pieceName].time }}pm
                </p>
            </div>
            <div class="card-body">
                <ul class="list-group list my--3">
                    <cast-list-item v-for="dancer in cast"
                                    :dancer="dancer"
                                    :piece="pieceName"
                                    :key="pieceName + dancer.name">
                    </cast-list-item>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import CastListItem from "./CastListItem";
    import {mapGetters} from 'vuex';

    export default {
        name: "CastListGroup",
        components: {CastListItem},
        props: ['cast', 'pieceName'],
        computed: {
            ...mapGetters(['metadata'])
        }
    }
</script>

<style scoped>
    .special-card-styles {
        border: 1px solid #13002b;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    }
</style>
