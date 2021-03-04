<template>
    <div class="row justify-content-center" v-if="filteredChangeLog.length === 0">
        <div class="col-auto">
            <h5>No Changes Found</h5>
        </div>
    </div>
    <div class="row" v-else>
        <div v-for="change_date in filteredChangeLog" :key="change_date.date">
            <p>{{ change_date.date }}</p>
            <change-log-item v-for="change in change_date.changes"
                             :key="change.name + change.type + change.piece"
                             :change-details="change"
                             :date="change_date.date"
                             :undo="true">
            </change-log-item>
            <hr>
        </div>
    </div>
</template>

<script>
    import ChangeLogItem from "./ChangeLogItem";

    export default {
        name: "ChangeLog",
        props: ['filteredChangeLog'],
        components: {ChangeLogItem},
    }
</script>

<style scoped>

</style>
