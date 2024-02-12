<template>
  <v-app dark>
    <Nav/>

    <v-main style="background-color: white">
      <v-container fluid class="pa-5">
        <Nuxt/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Nav from "../components/Common/Nav";


export default {
  head() {
    return {
    }
  },
  name: 'default',
  components: { Nav},
  middleware: ['auth'],
  data() {
    return {
      fixed: true,
      miniVariant: false,
      right: true,
      drawer: true,
      rightDrawer: false,
      fav: '/favicon.png',
      listLoader: false
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  methods: {

  }
}
</script>

<style>
html {
  font-family: "Poppins", serif;
}
</style>
