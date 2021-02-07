<template>
    <div class="wrapper">
        <base-card>
            <div class="row text-center">
                <div class="col-md-12">
                    <h1>Cast List</h1>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-auto">
                    <label for="dancerFilter" class="form-label">Filter Dancers</label>
                    <input class="form-control" list="dancerOptions"
                           v-model="filter_dancer_name"
                           @keyup="filterCastList"
                           id="dancerFilter" placeholder="Type to search..."/>
                    <datalist id="dancerOptions">
                        <option v-for="dancer in dancers" :key="'dancerFilter-' + dancer" :value="dancer"/>
                    </datalist>
                </div>
                <div class="col-md-auto">
                    <label for="pieceFilter" class="form-label">Filter Pieces</label>
                    <input class="form-control" list="pieceOptions"
                           v-model="filter_piece_name"
                           @keyup="filterCastList"
                           id="pieceFilter" placeholder="Type to search..."/>
                    <datalist id="pieceOptions">
                        <option v-for="piece in pieces"
                                :key="'pieceFilter-' + piece"
                                :value="piece"
                        />
                    </datalist>
                </div>
            </div>
        </base-card>
        <div class="row">
            <div class="col-md-8 col-sm-12">
                <base-card>
    <!--                <component :is="currentView" v-bind="currentProps"></component>-->
                    <cast-list :filtered-cast-list="filteredCastList"></cast-list>
                </base-card>
            </div>
            <div class="col-md-4 col-sm-12">
                <base-card>
                    <!--                <component :is="currentView" v-bind="currentProps"></component>-->
                    <change-log :filtered-change-log="filteredChangeLog"></change-log>
                </base-card>
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-auto">
                <base-button>Reset Add/Drop</base-button>
            </div>
        </div>
    </div>
</template>

<script>
    import BaseCard from "../components/UI/BaseCard";
    import BaseButton from "../components/UI/BaseButton";
    import { mapGetters } from 'vuex';
    import CastList from "../components/cast_list/CastList";
    import ChangeLog from "../components/cast_list/ChangeLog";

    export default {
        name: "ViewCastList",
        components: {CastList, BaseButton, BaseCard, ChangeLog},
        data() {
            return {
                filter_dancer_name: '',
                filter_piece_name: ''
            }
        },
        computed: {
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
        }
    }
</script>

<style scoped>
    .wrapper {
        max-width: 90%;
        margin: 0 auto;
    }
</style>
