<template>
  <the-header></the-header>
  <div class="wrapper">
    <router-view/>
  </div>
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

  .wrapper {
    max-width: 90%;
    margin: 0 auto;
  }
</style>
<script>
  import TheHeader from "./components/layout/TheHeader";

  export default {
    components: {TheHeader},
    beforeCreate() {
      this.$store.dispatch('loadConfig');
    }
  }
</script>
