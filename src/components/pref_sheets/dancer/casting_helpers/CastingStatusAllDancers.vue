<template>
    <base-card v-if="allDancerValid && dancerPrefsAll.length !== 0">
<!--        <div class="row">-->
<!--            <div class="col-auto">-->
                <table class="table table-striped">
                    <thead class="table-light">
                    <tr>
                        <th scope="col" @click="sort_key = 'name'">Name</th>
                        <th scope="col" class="text-center" @click="sort_key = 'max_dances'">Dances Cast vs Max Dances</th>
                        <th scope="col" class="text-center" @click="sort_key = 'max_days'">Days Cast vs Max Days</th>
                        <th scope="col" class="text-center" >Same Time</th>
                        <th scope="col" class="text-center" >Done</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="dancer_pref in dancerPrefsAll" :key="dancer_pref.name" >
                        <td>{{dancer_pref.name}}</td>
                        <td class="text-center" :class="getDancesValidClass(allDancerValid[dancer_pref.name].num_dances_cast, dancer_pref.max_dances)">{{allDancerValid[dancer_pref.name].num_dances_cast}} / {{dancer_pref.max_dances}}</td>
                        <td class="text-center" :class="getDancesValidClass(allDancerValid[dancer_pref.name].num_days_cast, dancer_pref.max_days)">{{allDancerValid[dancer_pref.name].num_days_cast}} / {{dancer_pref.max_days}}</td>
                        <td class="text-center" :class="{'more': allDancerValid[dancer_pref.name].same_time}"><span v-if="allDancerValid[dancer_pref.name].same_time">X</span></td>
                        <td class="text-center" :class="{'match': allDancerValid[dancer_pref.name].done}"><span v-if="allDancerValid[dancer_pref.name].done">&#10003;</span></td>

                        <td class="text-center"><base-badge title="Go to Dancer" :clickable="true" @click="changePref({type: 'jump', to: dancer_pref.name})"></base-badge></td>
                    </tr>
                    </tbody>
                </table>
<!--            </div>-->
<!--        </div>-->

    </base-card>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import BaseCard from "../../../UI/BaseCard";
    import BaseBadge from "../../../UI/BaseBadge";

    export default {
        name: "CastingStatusAllDancers",
        components: {BaseBadge, BaseCard},
        data() {
            return {
                sort_key: 'name'
            }
        },
        computed: {
            ...mapGetters('prefs', ['dancerPrefsAll', 'allDancerValid', 'validCalculated']),
        },
        methods: {
            ...mapActions('prefs', ['changePref']),
            getDancesValidClass(actual, wanted) {
                if (actual > wanted) {
                    return 'more'
                } else if (actual === wanted) {
                    return 'match'
                }
                return 'less'
            },
            getDaysValidClass(actual, wanted) {
                if (actual > wanted) {
                    return 'more'
                }
                return 'match'
            }
        }
    }
</script>

<style scoped>
    .match {
        background-color: rgba(14, 118, 35, 0.51);
        border: 1px solid rgb(14, 118, 35);
    }

    .more {
        background-color: rgba(255, 35, 13, 0.62);
        border: 1px solid rgba(255, 35, 13);
    }
</style>
