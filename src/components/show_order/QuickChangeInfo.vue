<template>
    <div class="row justify-content-center">
        <div class="col-11 alert alert-dark text-center shorten-dance-name">
            Quick Changes <strong>{{ keyName.toUpperCase() }}</strong>
            {{ selected_piece }}
        </div>
    </div>
    <div class="row justify-content-around">
        <div class="alert alert-danger col-3 text-center"
             :class="{'alert-light': dancers.length === 0}"
             v-for="(dancers, numbers) in current_quick_changes[keyName]"
             :key="keyName + '-' + numbers"
             @click="show_dancer_names(dancers, numbers)">
            <p><strong>{{ titles[numbers] }}</strong></p>
            <p>Dancers:<br> <strong style="font-size: 1.5rem">{{ dancers.length  }}</strong></p>
        </div>
    </div>
    <div class="row justify-content-around" v-if="!!show_names[keyName]">
        <div class="col-8 alert alert-info text-center">
            <p><strong>{{ titles[show_names[keyName]] }}</strong></p>
            <p v-for="dancer in dancer_names[keyName]"
               :key="dancer">{{ dancer }}</p>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "QuickChangeInfo",
        props: ['keyName'],
        data() {
            return {
                show_names: {into: false, after: false},
                dancer_names: {into: [], after: []},
                titles: {
                    0: 'Back to Back',
                    1: '1 Between',
                    2: '2 Between'
                }
            }
        },
        computed: {
            ...mapGetters('show_order', ['selected_piece', 'current_quick_changes'])
        },
        methods: {
            show_dancer_names(dancers, numbers) {
                if ((!!this.show_names[this.keyName] && numbers === this.show_names[this.keyName]) || (dancers.length === 0)) {
                    // hide names
                    this.show_names[this.keyName] = false;
                    this.dancer_names[this.keyName] = [];
                } else {
                    this.show_names[this.keyName] = numbers;
                    this.dancer_names[this.keyName] = dancers;
                }
            }
        },
        watch: {
            selected_piece() {
                this.show_names[this.keyName] = false;
                this.dancer_names[this.keyName] = [];
            }
        }
    }
</script>

<style scoped>

</style>
