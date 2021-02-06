<template>
    <base-card>
        <div class="row text-center">
            <div class="col-md-12">
                <h1>{{title}}</h1>
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
    <base-card>
        <component :is="currentView" v-bind="currentProps"></component>
    </base-card>
    <div class="row justify-content-center">
        <div class="col-auto">
            <base-button>Reset Add/Drop</base-button>
            <base-button @click="changeView">View {{ changeViewText }}</base-button>
        </div>
    </div>
</template>

<script>
    import BaseCard from "../components/UI/BaseCard";
    import BaseButton from "../components/UI/BaseButton";
    import { mapGetters, mapActions } from 'vuex';
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
            ...mapGetters('cast_list', ['castList', 'pieces', 'dancers', 'currentView']),
            filteredCastList() {
                let filteredCastList = JSON.parse(JSON.stringify(this.castList));

                if (this.filter_piece_name === '' && this.filter_dancer_name !== '') {
                    // only dancer filter
                    filteredCastList = filteredCastList.map((dance) => {
                        dance.cast = dance.cast.filter(dancer => dancer.toLowerCase().startsWith(this.filter_dancer_name.toLowerCase()));
                        return dance
                    }).filter(dance => dance.cast.length !== 0);
                } else if (this.filter_dancer_name === '' && this.filter_piece_name !== '') {
                    // only piece filter
                    filteredCastList = this.castList.filter(dance => dance.name.toLowerCase().startsWith(this.filter_piece_name.toLowerCase()));
                } else if (this.filter_dancer_name !== '' && this.filter_piece_name !== '') {
                    // both filters
                    filteredCastList = filteredCastList.map((dance) => {
                        dance.cast = dance.cast.filter(dancer => dancer.toLowerCase().startsWith(this.filter_dancer_name.toLowerCase()));
                        return dance
                    }).filter(dance => dance.cast.length !== 0 && dance.name.toLowerCase().startsWith(this.filter_piece_name.toLowerCase()));
                }

                return filteredCastList;
            },
            currentProps() {
                if (this.currentView === 'cast-list') {
                    return {filteredCastList: this.filteredCastList}
                }
                return {};
            },
            changeViewText() {
                if (this.currentView === 'change-log') {
                    return 'Cast List';
                } else if (this.currentView === 'cast-list') {
                    return 'Change Log';
                }
                return '';
            },
            title() {
                if (this.currentView === 'change-log') {
                    return 'Change Log';
                } else if (this.currentView === 'cast-list') {
                    return 'Cast List';
                }
                return '';
            }
        },
        methods: {
            ...mapActions('cast_list', ['changeView'])
        }
    }
</script>

<style scoped>

</style>
