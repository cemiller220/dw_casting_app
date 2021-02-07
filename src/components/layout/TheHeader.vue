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
            <div>
                <form class="d-flex" @submit.prevent>
                    <select class="form-select form-control me-2 city-select" aria-label="city"
                            @change="updateConfig('city', $event.target.value)">
                        <option value :selected="currentCity === ''">Choose a City</option>
                        <option value="nyc" :selected="currentCity === 'nyc'">NYC</option>
                        <option value="boston" :selected="currentCity === 'boston'">Boston</option>
                    </select>
                    <select class="form-select form-control me-2 season-select" aria-label="season"
                             @change="updateConfig('season', $event.target.value)">
                        <option value :selected="currentSeason === ''">Choose a Season</option>
                        <option value="14" :selected="currentSeason === '14'">Season 14</option>
                        <option value="15" :selected="currentSeason === '15'">Season 15</option>
                        <option value="16" :selected="currentSeason === '16'">Season 16</option>
                    </select>
                </form>
            </div>
        </div>
    </nav>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: "TheHeader",
        data() {
          return {
          }
        },
        computed: {
            ...mapGetters(['city', 'season']),
            currentCity() {
                return this.city;
            },
            currentSeason() {
                return this.season;
            },
            runCastingActive() {
                return this.$route.path === '/run_casting';
            },
            castListActive() {
                return this.$route.path === '/cast_list';
            },
            showOrderActive() {
                return this.$route.path === '/show_order';
            }
        },
        methods: {
            ...mapActions(['changeCitySeason']),
            updateConfig(field, value) {
                if (field === 'city') {
                    this.changeCitySeason({city: value, season: this.currentSeason})
                } else if (field === 'season') {
                    this.changeCitySeason({city: this.currentCity, season: value})
                }
            }
        }
    }
</script>

<style scoped>
    .city-select {
        width: 100px;
    }

    .season-select {
        width: 130px;
    }
</style>
