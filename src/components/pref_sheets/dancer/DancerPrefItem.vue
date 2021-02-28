<template>
    <li class="list-group-item" :class="castStatusClass" v-if="showPiece">
        <base-badge :title="index" color="blue" :clickable="false" class="float-start"></base-badge>
        {{ piece }}
        <div class="row">
            <div class="col text-center">
        <base-badge :title="currentStatus.rank" :color="statusBadgeColor" v-if="showStatusBadge" ></base-badge>
            </div>
        </div>
    </li>
</template>

<script>
    import BaseBadge from "../../UI/BaseBadge";
    import {mapGetters} from 'vuex';

    export default {
        name: "DancerPrefItem",
        components: {BaseBadge},
        props: ['index', 'piece', 'currentStatus'],
        computed: {
            ...mapGetters('dancer_prefs', ['showDropped']),
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
                    return this.currentStatus.preference !== 'not preffed'
                }
                return false;
            }
        }
    }
</script>

<style scoped>

</style>
