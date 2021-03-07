<template>
    <base-card>
        <div class="row text-center">
            <div class="col-md-12">
                <h1>Cast List</h1>
            </div>
        </div>
        <cast-list-header :dancers="dancers" :pieces="pieces" @filterCastList="updateFilters"></cast-list-header>
    </base-card>
    <div class="row">
        <div class="col-md-8 col-sm-12">
            <base-card>
                <cast-list :filtered-cast-list="filteredCastList"></cast-list>
            </base-card>
        </div>
        <div class="col-md-4 col-sm-12">
            <base-card>
                <change-log :filtered-change-log="filteredChangeLog"></change-log>
            </base-card>
        </div>
    </div>

    <div class="row justify-content-center">
        <div class="col-auto">
            <base-button @click="resetAll">Reset Add/Drop</base-button>
        </div>
    </div>
</template>

<script>
    import BaseCard from "../components/UI/BaseCard";
    import BaseButton from "../components/UI/BaseButton";
    import { mapGetters, mapActions } from 'vuex';
    import CastList from "../components/cast_list/CastList";
    import ChangeLog from "../components/cast_list/ChangeLog";
    import CastListHeader from "../components/cast_list/CastListHeader";

    export default {
        name: "ViewCastList",
        components: {CastListHeader, CastList, BaseButton, BaseCard, ChangeLog},
        data() {
            return {
                filter_dancer_name: '',
                filter_piece_name: ''
            }
        },
        computed: {
            ...mapGetters(['rehearsal_schedule_list']),
            ...mapGetters('cast_list', ['castList', 'pieces', 'dancers', 'changeLog']),
            filteredCastList() {
                let filteredCastList = JSON.parse(JSON.stringify(this.castList));

                if (this.filter_piece_name === '' && this.filter_dancer_name !== '') {
                    // only dancer filter
                    filteredCastList = filteredCastList.map((dance) => {
                        dance.cast = dance.cast.filter(dancer => dancer.name.toLowerCase().startsWith(this.filter_dancer_name.toLowerCase()));
                        return dance
                    }).filter(dance => dance.cast.length !== 0);
                } else if (this.filter_dancer_name === '' && this.filter_piece_name !== '') {
                    // only piece filter
                    filteredCastList = filteredCastList.filter(dance => dance.name.toLowerCase().startsWith(this.filter_piece_name.toLowerCase()));
                } else if (this.filter_dancer_name !== '' && this.filter_piece_name !== '') {
                    // both filters
                    filteredCastList = filteredCastList.map((dance) => {
                        dance.cast = dance.cast.filter(dancer => dancer.name.toLowerCase().startsWith(this.filter_dancer_name.toLowerCase()));
                        return dance
                    }).filter(dance => dance.cast.length !== 0 && dance.name.toLowerCase().startsWith(this.filter_piece_name.toLowerCase()));
                }

                return filteredCastList;
            },
            filteredChangeLog() {
                let filteredChangeLog = JSON.parse(JSON.stringify(this.changeLog));

                if (this.filter_piece_name === '' && this.filter_dancer_name !== '') {
                    // only dancer filter
                    filteredChangeLog = filteredChangeLog.map((changeList) => {
                        changeList.changes = changeList.changes.filter(change => change.name.toLowerCase().startsWith(this.filter_dancer_name.toLowerCase()));
                        return changeList
                    }).filter(changeList => changeList.changes.length !== 0);
                } else if (this.filter_dancer_name === '' && this.filter_piece_name !== '') {
                    // only piece filter
                    filteredChangeLog = filteredChangeLog.map((changeList) => {
                        changeList.changes = changeList.changes.filter(change => change.piece.toLowerCase().startsWith(this.filter_piece_name.toLowerCase()));
                        return changeList
                    }).filter(changeList => changeList.changes.length !== 0);
                } else if (this.filter_dancer_name !== '' && this.filter_piece_name !== '') {
                    // both filters
                    filteredChangeLog = filteredChangeLog.map((changeList) => {
                        changeList.changes = changeList.changes.filter(change => change.name.toLowerCase().startsWith(this.filter_dancer_name.toLowerCase()) && change.piece.toLowerCase().startsWith(this.filter_piece_name.toLowerCase()));
                        return changeList
                    }).filter(changeList => changeList.changes.length !== 0);
                }

                return filteredChangeLog;
            }
        },
        methods: {
            ...mapActions(['loadData']),
            ...mapActions('cast_list', ['resetAll']),
            updateFilters(filters) {
                this.filter_dancer_name = filters.filter_dancer_name;
                this.filter_piece_name = filters.filter_piece_name;
            }
        },
        created() {
            this.loadData({node: 'cast_list', mutation: 'cast_list/setCastList'});
            this.loadData({node: 'change_log', mutation: 'cast_list/setChangeLog'});
            this.loadData({node: 'metadata', mutation: 'setMetadata'});
        }
    }
</script>

<style scoped>

</style>
