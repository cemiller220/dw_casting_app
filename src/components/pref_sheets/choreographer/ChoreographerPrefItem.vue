<template>
    <li class="list-group-item" :class="dancerStatusClass" v-if="showDancer">
        <base-badge :title="index" color="blue" :clickable="false" class="float-start"></base-badge>
        {{ dancer }}
    </li>
</template>

<script>
    import BaseBadge from "../../UI/BaseBadge";
    import {mapGetters} from 'vuex';

    export default {
        name: "ChoreographerPrefItem",
        components: {BaseBadge},
        props: ['dancer', 'index', 'status'],
        computed: {
            ...mapGetters('prefs', ['showDropped']),
            showDancer() {
                return (this.dancerStatusClass === '' && this.showDropped) || (this.dancerStatusClass !== '')
            },
            dancerStatusClass() {
                if (!this.status) {
                    return '';
                } else {
                    return this.status === 'cast' ? 'list-group-item-success' : 'list-group-item-secondary';
                }
            }
        }
    }
</script>

<style scoped>

</style>
