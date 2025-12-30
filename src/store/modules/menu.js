/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const menu = {
  state: {
    menus: [],
    wheight: 800,
    wwidth: localStorage.getItem('wwidth')
  },

  mutations: {
    SET_MENU: (state, { menus }) => {
      state.menus = menus
    }
  },

  actions: {
    async getPermission({ commit }, { distributor_id }) {
      const res = await getPermission({ distributor_id })
      commit('SET_MENU', { menus: res.data.data })
    }
  }
}

export default menu
