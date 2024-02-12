<template>
  <Login/>
</template>

<script>
  import Login from "../../components/Auth/Login";

  export default {
    name: "index",
    layout: 'auth',
    components: {Login}
  }
</script>

<style>
  html {
    font-family: "Poppins",serif;
  }
</style>
