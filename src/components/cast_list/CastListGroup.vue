<template>
    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 justify-content-center">
        <div class="card special-card-styles">
            <div class="card-header text-center">
                <h5 class="h3 mb-0">{{ dance.name }}</h5>
                <p>{{ dance.choreographer }}<br>{{ dance.time.day }} {{ dance.time.time }}pm</p>
            </div>
            <div class="card-body">
                <ul class="list-group list my--3">
                    <li class="list-group-item"
                        :class="{'list-group-item-danger': dancer.status === 'waitlist'}"
                        v-for="dancer in dance.cast"
                        :key="dance.name + dancer">
                        {{ dancer.name }}
                        <base-badge :title="badgeTitle(dancer.status)"
                                    :color="badgeColor(dancer.status)"
                                    class="float-end">
                        </base-badge>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import BaseBadge from "../UI/BaseBadge";

    export default {
        name: "CastListGroup",
        props: ['dance'],
        components: {BaseBadge},
        methods: {
            badgeTitle(status) {
                return status === 'cast' ? 'Drop' : 'Add'
            },
            badgeColor(status) {
                return status === 'cast' ? 'red' : 'green'
            }
        }
    }
</script>

<style scoped>
    .special-card-styles {
        border: 1px solid #13002b;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    }
</style>
