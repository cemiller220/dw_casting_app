<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">DanceWorks</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link class="nav-link" :class="{'active': runCastingActive}"
                                     aria-current="page" to="/run_casting">Run Casting</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :class="{'active': castListActive}"
                                     aria-current="page" to="/cast_list">View Cast List</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :class="{'active': showOrderActive}"
                                     aria-current="page" to="/show_order">Show Order</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "TheHeader",
        computed: {
            runCastingActive() {
                return this.$route.path === '/run_casting';
            },
            castListActive() {
                return this.$route.path === '/cast_list';
            },
            showOrderActive() {
                return this.$route.path === '/show_order';
            }
        }
    }
</script>

<style scoped>

</style>
