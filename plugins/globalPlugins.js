import Vue from 'vue'
import logo from 'static/logo.png'
import validationMixin from '@/mixins/validationMixin'
import ZoomOnHover from "vue-zoom-on-hover";
Vue.use(ZoomOnHover);
Vue.mixin({
  computed: {
    bp() {
      return this.$vuetify.breakpoint
    },
  },
  data() {
    return {
      logo,
      drawer: true,
      dashboardFilterMode : false,
    }
  },
  methods: {
  }
});

Vue.mixin(validationMixin)
