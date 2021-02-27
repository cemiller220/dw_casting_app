<template>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h3>Dancer: <strong>{{ currentPref.name }}</strong></h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h4>Max Dances: <strong>{{ currentPref.max_dances }}</strong></h4>
        </div>
        <div class="col-auto">
            <h4>Max Days: <strong>{{ currentPref.max_days }}</strong></h4>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h4>Notes: {{ currentPref.notes }}</h4>
        </div>
    </div>
<!--    <div class="row justify-content-center">-->
<!--        <div class="col-auto">-->
<!--            <base-button @click="toggleShowDropped">-->
<!--                {{ showDropped ? 'Hide' : 'Show' }} Dropped Dancers-->
<!--            </base-button>-->
<!--        </div>-->
<!--    </div>-->
</template>

<script>
    // import BaseButton from "../../UI/BaseButton";
    import {mapGetters} from 'vuex';

    export default {
        name: "DancerPrefInfo",
        // components: {BaseButton},
        computed: {
            ...mapGetters('dancer_prefs', ['currentPref'])
        }
    }
</script>

<style scoped>

</style>
