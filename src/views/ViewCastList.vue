<template>
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
    <base-card>
        <div class="row justify-content-center">
            <cast-list-group v-for="dance in filteredCastList" :key="dance.name" class="dance-card"
                             :dance="dance">
            </cast-list-group>
        </div>
    </base-card>
    <div class="row justify-content-center">
        <div class="col-auto">
            <base-button>Reset Add/Drop</base-button>
            <base-button>View Change Log</base-button>
        </div>
    </div>
</template>

<script>
    import BaseCard from "../components/UI/BaseCard";
    import BaseButton from "../components/UI/BaseButton";
    import CastListGroup from "../components/cast_list/CastListGroup";
    import { mapGetters } from 'vuex';

    export default {
        name: "ViewCastList",
        components: {CastListGroup, BaseButton, BaseCard},
        data() {
            return {
                filteredCastList: [],
                filter_dancer_name: '',
                filter_piece_name: ''
            }
        },
        computed: {
            ...mapGetters('cast_list', ['castList', 'pieces', 'dancers']),
        },
        methods: {
            filterCastList() {
                this.filteredCastList = JSON.parse(JSON.stringify(this.castList));

                if (this.filter_piece_name === '' && this.filter_dancer_name !== '') {
                    // only dancer filter
                    this.filteredCastList = this.filteredCastList.map((dance) => {
                        dance.cast = dance.cast.filter(dancer => dancer.toLowerCase().startsWith(this.filter_dancer_name.toLowerCase()));
                        return dance
                    }).filter(dance => dance.cast.length !== 0);
                } else if (this.filter_dancer_name === '' && this.filter_piece_name !== '') {
                    // only piece filter
                    this.filteredCastList = this.castList.filter(dance => dance.name.toLowerCase().startsWith(this.filter_piece_name.toLowerCase()));
                } else if (this.filter_dancer_name !== '' && this.filter_piece_name !== '') {
                    // both filters
                    this.filteredCastList = this.filteredCastList.map((dance) => {
                        dance.cast = dance.cast.filter(dancer => dancer.toLowerCase().startsWith(this.filter_dancer_name.toLowerCase()));
                        return dance
                    }).filter(dance => dance.cast.length !== 0 && dance.name.toLowerCase().startsWith(this.filter_piece_name.toLowerCase()));
                }
            }
        },
        created() {
            this.filterCastList();
        }
    }
</script>

<style scoped>
    .dance-card {
        padding: 12px;
    }
</style>
