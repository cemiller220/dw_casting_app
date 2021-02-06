<template>
    <span class="badge" :class="color">
        {{ text }}
    </span>
</template>

<script>
    export default {
        name: "BaseBadge",
        props: ['color', 'title'],
        computed: {
            text() {
                return this.title.toUpperCase();
            }
        }
    }
</script>

<style scoped>
    .badge {
        background-color: #ccc;
        color: #252525;
        border-radius: 30px;
        padding: 0.5rem 1rem;
        display: inline-block;
        margin-right: 0.5rem;
        cursor: pointer;
    }

    span:hover {
        background-color: #a9a9a9;
    }

    .red {
        background-color: #740C11;
        color: white;
    }

    span.red:hover {
        background-color: #360607;
    }

    .green {
        background-color: #117441;
        color: white;
    }

    span.green:hover {
        background-color: #093B21;
    }
</style>
