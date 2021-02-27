<template>
    <base-card>
        <div class="row justify-content-center">
            <div class="col" v-for="(_, day) in rehearsal_schedule.first" :key="day + 'title'">
                <base-card class="text-center">
                <h3>{{ day }}</h3>
                </base-card>

            </div>
        </div>
        <div class="row justify-content-center" v-for="(days, time_slot) in rehearsal_schedule" :key="time_slot" >
            <div class="col" v-for="(pieces, day) in days" :key="day + '-' + time_slot" style="padding: 0 10px 20px 10px;">
                <base-card class="h-100">
                    <ul class="list-group list my--3" v-for="piece in pieces" :key="piece">
                        <li class="list-group-item">
                            {{ piece }}
                        </li>
                    </ul>
                </base-card>
            </div>
        </div>
    </base-card>
</template>

<script>
    import BaseCard from "../UI/BaseCard";

    export default {
        name: "CalendarView",
        components: {BaseCard},
        data() {
            return {
                rehearsal_schedule: {'first': {'Sunday': ['Domino'],
                        'Monday': ['Someone in the Crowd', 'Bennie and the Jets'],
                        'Tuesday': ['Tempo', "We Don't Eat"],
                        'Wednesday': ['Bury a Friend', 'Toy Story'],
                        'Thursday': ['Broken Vow', 'Toxic']
                    },
                    'second': {'Sunday': ['The Chain', 'Peace May Come'],
                        'Monday': ["Throwin' it Back", 'Slow Dancing in a Burning Room'],
                        'Tuesday': ['Shadowboxing', 'I Have Nothing'],
                        'Wednesday': ['90 Days', 'Sick Boy'],
                        'Thursday': ['Bad Guy', 'Heartbeat']
                    },
                    'third': {'Sunday': ['An Evening I Will Not Forget', 'Love So Soft'],
                        'Monday': ['New Americana', "I Don't Think About You"],
                        'Tuesday': ['Sing', 'As the Water'],
                        'Wednesday': ['Knock on Wood', 'Eve'],
                        'Thursday': ['Bailar', 'Hollywood']
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
