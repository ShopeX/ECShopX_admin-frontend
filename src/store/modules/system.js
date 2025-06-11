const systemStore = {
  namespaced: true,
  state: {
    logo: ''
  },
  mutations: {
    setSystemLogo(state, { logo }) {
      state.logo = logo
    }
  }
}

export default systemStore
