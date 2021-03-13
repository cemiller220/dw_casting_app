<template>
    <base-card v-if="currentPref && currentStatuses && metadata">
        <div class="row justify-content-center">
            <div class="col" v-for="day in days_order" :key="day + 'title'">
                <base-card class="text-center">
                <h3>{{ day }}</h3>
                </base-card>

            </div>
        </div>
        <div class="row justify-content-center" v-for="time_slot in times_order" :key="time_slot" >
            <div class="col schedule-col" v-for="day in days_order" :key="day + '-' + time_slot">
                <base-card class="h-100 ">
                    <div class="item-wrapper" v-for="piece in metadata.rehearsal_schedule[time_slot][day]" :key="piece" :piece="piece" v-show="pieceIndex(piece) !== -1">
                        <dancer-pref-item :index="pieceIndex(piece)+1"
                                          :piece="piece"
                                          :currentStatus="currentStatuses[piece]"
                                          :keepDrop="keepDrop[piece]"
                                          :type="type">
                        </dancer-pref-item>
                    </div>
                </base-card>
            </div>
        </div>
    </base-card>
</template>

<script>
    import BaseCard from "../../../UI/BaseCard";
    import DancerPrefItem from "../DancerPrefItem";
    import {mapGetters} from "vuex";
    // import CastingHelpers from "../casting_helpers/CastingHelpers";

    export default {
        name: "CalendarView",
        components: {DancerPrefItem, BaseCard},
        props: ['type'],
        data() {
            return {
                times_order: ['first', 'second', 'third'],
                days_order: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            }
        },
        computed: {
            ...mapGetters(['metadata']),
            ...mapGetters('prefs', ['currentPref', 'currentStatuses', 'keepDrop']),
        },
        methods: {
            pieceIndex(piece) {
                if (this.currentPref.prefs) {
                    return this.currentPref.prefs.indexOf(piece);
                }
                return -1;
            }
        }
    }
</script>

<style scoped>
    .item-wrapper {
        padding: 5px 0;
        border-radius: 5px;
    }

    .schedule-col {
        padding: 0 10px 20px 10px;
    }
</style>
