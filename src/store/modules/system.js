const systemStore = {
  namespaced: true,
  state: {
    logo: '',
    versionMode: '',
    lang: 'zhcn'
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
    },
    updateLang(state, { lang }) {
      state.lang = lang
    }
  }
}

export default systemStore
