<template>
    <base-card v-if="currentPref && currentStatuses && rehearsalSchedule">
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
                    <div class="item-wrapper" v-for="piece in rehearsalSchedule[time_slot][day]" :key="piece" :piece="piece" v-show="pieceIndex(piece) !== -1">
                        <dancer-pref-item :index="pieceIndex(piece)"
                                          :piece="piece"
                                          :currentStatus="currentStatuses[piece]">
                        </dancer-pref-item>
                        <casting-helpers v-if="type === 'cast'"></casting-helpers>
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
    import CastingHelpers from "../casting_helpers/CastingHelpers";

    export default {
        name: "CalendarView",
        components: {CastingHelpers, DancerPrefItem, BaseCard},
        props: ['type'],
        data() {
            return {
                times_order: ['first', 'second', 'third'],
                days_order: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            }
        },
        computed: {
            ...mapGetters('prefs', ['currentPref', 'currentStatuses', 'rehearsalSchedule'])
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
