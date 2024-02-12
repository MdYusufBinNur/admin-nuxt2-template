<template>
  <v-app dark style="background-color: transparent">
    <v-container bg fill-height grid-list-md text-xs-center>
      <v-layout row wrap align-center>
        <v-flex>
          <div v-if="error.statusCode === 404">
            <Error404  :page-not-found="true"/>
          </div>
          <div v-else>
            <Error404 :page-not-found="false" />
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import Error404 from "../components/Common/Error404";
export default {
  components: {Error404},
  layout: 'auth',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
html {
  font-family: "Poppins",serif;
}
</style>
