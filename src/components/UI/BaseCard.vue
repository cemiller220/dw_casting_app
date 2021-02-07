<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "BaseCard"
    }
</script>

<style scoped>
    .card {
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
        padding: 1rem;
        margin-top: 1rem;
        /*max-width: 90%;*/
    }
</style>
