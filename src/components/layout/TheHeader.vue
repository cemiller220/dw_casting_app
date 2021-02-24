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
                        <router-link class="nav-link" :class="{'active': choreographerPrefsActive}"
                                     aria-current="page" to="/prefs/choreographer">Choreographer Prefs</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :class="{'active': showOrderActive}"
                                     aria-current="page" to="/show_order">Show Order</router-link>
                    </li>
                </ul>
            </div>
            <div>
                <form class="d-flex" @submit.prevent>
                    <div class="login-button" v-if="!loggedIn">
                        <button class="btn btn-outline-light" @click="auth({mode: 'login', email: email, password: password})">Login</button>
                    </div>
                    <select class="form-select form-control me-2 city-select" aria-label="city"
                            @change="updateConfig('city', $event.target.value)">
                        <option value :selected="currentCity === ''">Choose a City</option>
                        <option value="nyc" :selected="currentCity === 'nyc'">NYC</option>
                        <option value="boston" :selected="currentCity === 'boston'">Boston</option>
                    </select>
                    <select class="form-select form-control me-2 season-select" aria-label="season"
                             @change="updateConfig('season', $event.target.value)">
                        <option value :selected="currentSeason === ''">Choose a Season</option>
                        <option v-for="season_num in seasonOptions" :key="currentCity + season_num" :value="season_num" :selected="currentSeason === season_num">Season {{ season_num }}</option>
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
                email: 'dwcasting@test.com',
                password: 'DWcasting'
            }
        },
        computed: {
            ...mapGetters(['city', 'season', 'nyc_seasons', 'boston_seasons', 'loggedIn']),
            currentCity() {
                return this.city;
            },
            currentSeason() {
                console.log(this.season);
                return this.season;
            },
            seasonOptions() {
                if (this.currentCity === 'nyc') {
                    return this.nyc_seasons;
                } else {
                    return this.boston_seasons;
                }

            },
            runCastingActive() {
                return this.$route.path === '/run_casting';
            },
            castListActive() {
                return this.$route.path === '/cast_list';
            },
            showOrderActive() {
                return this.$route.path === '/show_order';
            },
            choreographerPrefsActive() {
                return this.$route.path === '/prefs/choreographer'
            }
        },
        methods: {
            ...mapActions(['changeCitySeason', 'auth']),
            updateConfig(field, value) {
                console.log('update method');
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

    .login-button {
        margin: 0 0.5rem;
    }
</style>
