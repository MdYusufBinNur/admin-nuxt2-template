export default function ({ app, store, $axios }) {
  return {
    headers: {
      'content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin' : '*'
    }
  }
  // $axios.interceptors.request.use(function (config) {
  //   if (store.getters['auth/auth']) {
  //     config.headers.Authorization = `Bearer ${store.getters['auth/auth']}`
  //   }
  //   return config
  // })
}
