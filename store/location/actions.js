export default {
  initLocations (context, payload) {
    return this.$axios
      .get('districts')
      .then((response) => {
        context.commit('setLocations', response.data.data)
        return response
      })
  },
  activeLocations(context)
  {
    return this.$axios.get('active-district')
      .then((response) => {
        context.commit('setActiveLocations', response.data.data)
        return response;
      })
  },
  activeSubs(context)
  {
    return this.$axios.get('active-sub')
      .then((response) => {
        context.commit('setActiveSub', response.data.data)
        return response;
      })
  }
}
