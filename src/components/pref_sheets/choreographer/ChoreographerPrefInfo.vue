<template>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h3>Dance: <strong>{{ currentPref.name }}</strong></h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h4>Choreographer:
                <strong>{{ currentPref.choreographer }}</strong>
            </h4>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-auto">
            <base-button @click="toggleShowDropped">
                {{ showDropped ? 'Hide' : 'Show' }} Dropped Dancers
            </base-button>
        </div>
    </div>
</template>

<script>
    import BaseButton from "../../UI/BaseButton";
    import {mapActions, mapGetters} from 'vuex';
    export default {
        name: "ChoreographerPrefInfo",
        components: {BaseButton},
        computed: {
            ...mapGetters('choreographer_prefs', ['showDropped', 'currentPref'])
        },
        methods: {
            ...mapActions('choreographer_prefs', ['toggleShowDropped'])
        }
    }
</script>

<style scoped>

</style>
