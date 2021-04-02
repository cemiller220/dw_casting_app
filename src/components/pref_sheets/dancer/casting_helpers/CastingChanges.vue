<template>
    <div class="text-center">
        <h3>Casting Changes</h3>
    </div>

    <change-log-item v-for="change in lastChanges" :key="change.name + change.piece + change.type"
                     :change-details="change" :undo="false"></change-log-item>
</template>

<script>
    import ChangeLogItem from "../../../cast_list/ChangeLogItem";
    import {mapGetters} from 'vuex';

    export default {
        name: "CastingChanges",
        components: {ChangeLogItem},
        computed: {
            ...mapGetters('run_casting', ['lastChanges'])
        }
    }
</script>

<style scoped>

</style>
