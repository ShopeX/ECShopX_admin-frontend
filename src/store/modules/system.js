const systemStore = {
  namespaced: true,
  state: {
    logo: '',
    versionMode: ''
  },
  mutations: {
    setSystemLogo(state, { logo }) {
      state.logo = logo
    },
    setVersionMode(state, { versionMode }) {
      state.versionMode = versionMode
    },
    logout(state) {
      state.logo = ''
      state.versionMode = ''
    }
  }
}

export default systemStore
