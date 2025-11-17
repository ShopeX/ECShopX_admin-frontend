/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const systemStore = {
  namespaced: true,
  state: {
    logo: '',
    versionMode: '',
    lang: process.env.VUE_APP_DEFAULT_LANG
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
