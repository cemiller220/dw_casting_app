<template>
    <div class="style-alert" :class="logStyleClass">
        {{ changeDetails.type }}
        <strong>{{ changeDetails.name }}</strong>
        {{ toFrom }}
        <strong>{{ changeDetails.piece }}</strong>
        <base-badge title="Undo" class="float-end"></base-badge>
    </div>
</template>

<script>
    import BaseBadge from "../UI/BaseBadge";
    export default {
        name: "ChangeLogItem",
        props: ['changeDetails'],
        components: {BaseBadge},
        computed: {
            toFrom() {
                return this.changeDetails.type === 'Added' ? 'to' : 'from';
            },
            logStyleClass() {
                if (this.changeDetails.type === 'Added') {
                    return 'alert-success'
                } else {
                    return 'alert-danger'
                }
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
