import Cookies from 'js-cookie'
import { getPermission } from '@/api/auth'
// import agent from '../../../../dealer.json';
// import agent from '../../../../shopadmin.json';

function menuGet (key) {
  var url = window.location.href
  var pathPrefix = process.env.PREFIXES
  if (url.indexOf('shopadmin') !== -1) {
    key = key + pathPrefix + '/shopadmin'
  } else {
    key = key + pathPrefix
  }
  return JSON.parse(localStorage.getItem(key))
}

const menu = {
  state: {
    menus: [],
    wheight: 800,
    wwidth: localStorage.getItem('wwidth')
  },

  mutations: {
    SET_MENU: (state, { menus }) => {
      state.menus = menus
    },

    setMenu: (state, menu) => {
      state.menus = menu
      var key = 'menu'
      var url = window.location.href
      var pathPrefix = process.env.PREFIXES
      if (url.indexOf('shopadmin') !== -1) {
        key = key + pathPrefix + '/shopadmin'
      } else {
        key = key + pathPrefix
      }
      localStorage.setItem(key, JSON.stringify(menu))
    },

    setWidth: (state, width) => {
      state.wwidth = width
      localStorage.setItem('wwidth', width)
    },
    setHeight: (state, height) => {
      state.wheight = height
      localStorage.setItem('wheight', height)
    }
  },

  actions: {
    async getPermission ({ commit }, { distributor_id }) {
      // console.log(2222222);
      const res = await getPermission({ distributor_id })
      commit('SET_MENU', { menus: res.data.data })
      // const res = agent
      // commit('SET_MENU', { menus: res.data })
    },
    setMenu ({ commit }, menu) {
      commit('setMenu', menu)
    },
    setWidth ({ commit }, width) {
      commit('setWidth', width)
    },
    setHeight ({ commit }, height) {
      commit('setHeight', height)
    }
  },

  getters: {
    menus (state) {
      return state.menus
    },
    wheight (state) {
      return state.wheight
    },
    wwidth (state) {
      return state.wwidth
    }
  }
}

export default menu
