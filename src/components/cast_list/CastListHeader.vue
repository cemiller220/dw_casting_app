<template>
    <div class="row justify-content-center">
        <div class="col-md-auto">
            <label for="dancerFilter" class="form-label">Filter Dancers</label>
            <input class="form-control" list="dancerOptions"
                   v-model="filter_dancer_name"
                   id="dancerFilter" placeholder="Type to search..."/>
            <datalist id="dancerOptions">
                <option v-for="dancer in dancers" :key="'dancerFilter-' + dancer" :value="dancer"/>
            </datalist>
        </div>
        <div class="col-md-auto">
            <label for="pieceFilter" class="form-label">Filter Pieces</label>
            <input class="form-control" list="pieceOptions"
                   v-model="filter_piece_name"
                   id="pieceFilter" placeholder="Type to search..."/>
            <datalist id="pieceOptions">
                <option v-for="piece in pieces"
                        :key="'pieceFilter-' + piece"
                        :value="piece"
                />
            </datalist>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CastListHeader",
        props: ['dancers', 'pieces'],
        emits: ['filterCastList'],
        data() {
            return {
                filter_dancer_name: '',
                filter_piece_name: ''
            }
        },
        watch: {
            filter_dancer_name() {
                this.$emit('filterCastList', {
                    filter_dancer_name: this.filter_dancer_name,
                    filter_piece_name: this.filter_piece_name
                })
            },
            filter_piece_name() {
                this.$emit('filterCastList', {
                    filter_dancer_name: this.filter_dancer_name,
                    filter_piece_name: this.filter_piece_name
                })
            }
        }
    }
</script>

<style scoped>

</style>
