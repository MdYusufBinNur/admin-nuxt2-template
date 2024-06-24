import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'Adbarta - %s ',
    title: 'Adbarta - the biggest marketplace',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "~layouts/global.css"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/globalPlugins.js',
    '@/plugins/axios.js',
    '~/plugins/echarts.js',
    {src: '~plugins/vueEditor.js', mode: 'client', ssr: false},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    "vue-toastification/nuxt",
    ['nuxt-i18n', {
      locales: [
        {
          code: 'en',
          file: 'en-US.js',
          name: 'English'
        }
      ],
      lazy: true,
      langDir: 'lang/',
      defaultLocale: 'en',
      detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_redirected',
        redirectOn: 'root'  // recommended
      }
    }]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'https://api.adbarta.com/api/v1'
    // baseURL: 'http://adbarta-api/api/v1',
    // baseURL: 'https://service.gcare.com.bd/api/v1',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          background: '#252525',
          surface: '#FFFFFF',
          // primary: '#6200EE',
          'primary-darken-1': '#262626',
          // secondary: '#03DAC6',
          'secondary-darken-1': '#018786',
          error: '#B00020',
          info: '#4973fd',
          success: '#4CAF50',
          warning: 'rgb(178,180,180)',
          primary: '#252525',
          accent: '#252525',
          secondary: '#252525',
          lighter: '#FFFFFF',
          darker: '#FFFFFF',
        },
        dark: {
          background: '#252525',
          surface: '#FFFFFF',
          // primary: '#6200EE',
          'primary-darken-1': '#262626',
          // secondary: '#03DAC6',
          'secondary-darken-1': '#018786',
          error: '#B00020',
          info: 'rgba(18,130,218,0.92)',
          success: '#4CAF50',
          warning: 'rgb(178,180,180)',
          primary: '#252525',
          accent: '#252525',
          secondary: '#FFFFFF',
          lighter: '#FFFFFF',
          darker: '#FFFFFF',
        },
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  auth: {
    strategies: {
      local: {
        token: {
          property: 'data.token',
          global: true
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: false
        },
        endpoints: {
          login: {url: '/login', method: 'post'},
          logout: {url: '/logout', method: 'get'},
          user: {url: '/profile', method: 'get'}
        }
      }
    },
    redirect: {
      login: '/auth',
      logout: '/auth',
      callback: '/auth',
      home: '/dashboard'
    }
  }
}
