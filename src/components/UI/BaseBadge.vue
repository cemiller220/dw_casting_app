<template>
    <span class="badge" :class="[color, {'clickable': clickable}]">
        {{ text }}
    </span>
</template>

<script>
    export default {
        name: "BaseBadge",
        props: ['color', 'title', 'clickable'],
        computed: {
            text() {
                return this.title.toString().toUpperCase();
            }
        }
    }
</script>

<style scoped>
    .badge {
        background-color: #ccc;
        color: #252525;
        border-radius: 30px;
        padding: 0.5rem 0.7rem;
        display: inline-block;
        margin-right: 0.5rem;

    }

    .clickable {
        cursor: pointer;
    }

    span.clickable:hover {
        background-color: #a9a9a9;
    }

    .red {
        background-color: #740C11;
        color: white;
    }

    span.red.clickable:hover {
        background-color: #360607;
    }

    .green {
        background-color: #117441;
        color: white;
    }

    span.green.clickable:hover {
        background-color: #093B21;
    }

    .blue {
        background-color: #185074;
        color: white;
    }

    span.blue.clickable:hover {
        background-color: #0c2739;
    }
</style>
