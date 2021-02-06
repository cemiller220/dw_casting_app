<template>
    <li class="list-group-item"
        :class="{'list-group-item-danger': dancer.status === 'waitlist'}">
        {{ dancer.name }}
        <base-badge :title="badgeTitle"
                    :color="badgeColor"
                    @click="changeStatus"
                    class="float-end">
        </base-badge>
    </li>
</template>

<script>
    import BaseBadge from "../UI/BaseBadge";
    import { mapActions } from 'vuex';

    export default {
        name: "CastListItem",
        props: ['dancer', 'piece'],
        emits: ['change-status'],
        components: {BaseBadge},
        computed: {
            badgeTitle() {
                return this.dancer.status === 'cast' ? 'Drop' : 'Add'
            },
            badgeColor() {
                return this.dancer.status === 'cast' ? 'red' : 'green'
            },
        },
        methods: {
            ...mapActions('cast_list', ['changeDancerStatus']),
            changeStatus() {
                if (this.dancer.status === 'cast') {
                    // drop
                    this.changeDancerStatus({piece: this.piece, dancerName: this.dancer.name, changeType: 'drop'})
                } else {
                    // add
                    this.changeDancerStatus({piece: this.piece, dancerName: this.dancer.name, changeType: 'add'})
                }
            },
        }
    }
</script>

<style scoped>

</style>
