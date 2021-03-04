<template>
    <div class="style-alert" :class="logStyleClass">
        {{ typeStr }}
        <strong>{{ changeDetails.name }}</strong>
        {{ toFrom }}
        <strong>{{ changeDetails.piece }}</strong>
        <div class="row justify-content-end" v-if="undo">
            <div class="col-auto">
                <base-badge title="Undo" :clickable="true" @click="undoCurrentChange"></base-badge>
            </div>
        </div>
    </div>
</template>

<script>
    import BaseBadge from "../UI/BaseBadge";
    import { mapActions } from 'vuex';
    export default {
        name: "ChangeLogItem",
        props: ['changeDetails', 'date', 'undo'],
        components: {BaseBadge},
        computed: {
            typeStr() {
                return this.changeDetails.type === 'add' ? 'Added' : 'Dropped';
            },
            toFrom() {
                return this.changeDetails.type === 'add' ? 'to' : 'from';
            },
            logStyleClass() {
                if (this.changeDetails.type === 'add') {
                    return 'alert-success'
                } else {
                    return 'alert-danger'
                }
            }
        },
        methods: {
            ...mapActions('cast_list', ['undoChange']),
            undoCurrentChange() {
                this.undoChange({
                    date: this.date,
                    piece: this.changeDetails.piece,
                    type: this.changeDetails.type,
                    dancerName: this.changeDetails.name
                });
            }
        }
    }
</script>

<style scoped>
    .style-alert {
        margin: 10px 0;
        padding: 10px;
        border-radius: 5px;
    }
</style>
