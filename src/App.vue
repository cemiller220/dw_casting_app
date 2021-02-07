<template>
  <the-header></the-header>
  <router-view/>
</template>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

  * {
    box-sizing: border-box;
  }

  html {
    font-family: "Roboto", sans-serif;
  }

  body {
    margin: 0;
  }
</style>
<script>
  import TheHeader from "./components/layout/TheHeader";
  // import { mapActions } from 'vuex';

  export default {
    components: {TheHeader},
    methods: {
      // ...mapActions(['loadConfig'])
    },
    beforeCreate() {
      this.$store.dispatch('loadConfig');
    }
  }
</script>
