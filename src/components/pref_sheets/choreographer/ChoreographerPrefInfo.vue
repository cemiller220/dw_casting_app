<template>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h3>Dance: <strong>{{ name }}</strong></h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h4>Choreographer:
                <strong>{{ choreographer }}</strong>
            </h4>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-auto">
            <base-button @click="hideDrop()">
                {{ showDrop ? 'Hide' : 'Show' }} Dropped Dancers
            </base-button>
        </div>
    </div>
</template>

<script>
    import BaseButton from "../../UI/BaseButton";
    export default {
        name: "ChoreographerPrefInfo",
        components: {BaseButton},
        props: ['name', 'choreographer', 'showDrop']
    }
</script>

<style scoped>

</style>
