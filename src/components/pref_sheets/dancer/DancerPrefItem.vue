<template>
    <li class="list-group-item"
        :class="[castStatusClass, {keep: keepDrop === 'keep' && page === 'cast', drop: keepDrop === 'drop' && page === 'cast'}]"
        v-if="showPiece">
        <base-badge :title="index" color="blue" :clickable="false" class="float-start"></base-badge>
        {{ piece }}
        <div class="row" v-if="view === 'calendar'">
            <div class="col text-center">
                <base-badge :title="currentStatus.rank" :color="statusBadgeColor" v-if="showStatusBadge" ></base-badge>
            </div>
        </div>
        <base-badge :title="currentStatus.rank" :color="statusBadgeColor" v-else-if="showStatusBadge" class="float-end"></base-badge>
        <div v-if="type === 'cast' && showHelpers">
            <br/>
            <casting-helpers :keepDrop="keepDrop" :piece="piece"></casting-helpers>
        </div>
    </li>

</template>

<script>
    import BaseBadge from "../../UI/BaseBadge";
    import {mapGetters} from 'vuex';
    import CastingHelpers from "./casting_helpers/CastingHelpers";

    export default {
        name: "DancerPrefItem",
        components: {CastingHelpers, BaseBadge},
        props: ['index', 'piece', 'currentStatus', 'type', 'keepDrop'],
        computed: {
            ...mapGetters('prefs', ['showDropped', 'view']),
            castStatusClass() {
                if (this.currentStatus) {
                    if (this.currentStatus.status === 'cast') {
                        return 'list-group-item-success'
                    } else if (this.currentStatus.status === 'waitlist') {
                        return 'list-group-item-secondary'
                    }
                }
                return '';
            },
            showPiece() {
                return (this.castStatusClass === '' && this.showDropped) || (this.castStatusClass !== '')
            },
            statusBadgeColor() {
                if (this.currentStatus) {
                    if (this.currentStatus.preference === 'favorite') {
                        return 'green'
                    }
                }
                return '';
            },
            showStatusBadge() {
                if (this.currentStatus) {
                    return this.currentStatus.preference !== ''
                }
                return false;
            },
            showHelpers() {
                return this.currentStatus && this.currentStatus.status !== 'dropped' && this.currentStatus.status !== ''
            },
            page() {
                if (this.$router.currentRoute.value.fullPath === '/prefs/dancer') {
                    return 'pref'
                } else {
                    return 'cast'
                }
            }
        }
    }
</script>

<style scoped>
    .keep {
        border: 2px solid green;
    }

    .drop {
        border: 2px solid red;
    }
</style>
