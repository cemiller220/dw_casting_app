<template>
    <div class="row">
        <div v-for="change_date in changeLog" :key="change_date.date">
            <p>{{ change_date.date }}</p>
            <change-log-item v-for="change in change_date.changes"
                             :key="change.name + change.type + change.piece"
                             :change-details="change">
            </change-log-item>
            <hr>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import ChangeLogItem from "./ChangeLogItem";

    export default {
        name: "ChangeLog",
        components: {ChangeLogItem},
        computed: {
            ...mapGetters('cast_list', ['changeLog'])
        }
    }
</script>

<style scoped>

</style>
