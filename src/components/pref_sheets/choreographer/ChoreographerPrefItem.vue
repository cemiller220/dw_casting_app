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
        props: ['dancer', 'index', 'currentCast'],
        computed: {
            ...mapGetters('prefs', ['showDropped']),
            showDancer() {
                return (this.dancerStatusClass === '' && this.showDropped) || (this.dancerStatusClass !== '')
            },
            dancerStatusClass() {
                if (!this.currentCast || this.currentCast.filter(dancer => dancer.name === this.dancer).length === 0) {
                    return '';
                } else {
                    return this.currentCast.filter(dancer => dancer.name === this.dancer)[0].status === 'cast' ? 'list-group-item-success' : 'list-group-item-secondary';
                }
            }
        }
    }
</script>

<style scoped>

</style>
