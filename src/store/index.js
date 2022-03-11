import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import user from './modules/user'
import menu from './modules/menu'
import sku from './modules/sku'
import getters from './getters'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  key: '__presist',
  storage: window.localStorage,
  modules: ['user']
})

const store = new Vuex.Store({
  modules: {
    menu,
    user,
    sku
  },
  getters,
  plugins: [vuexLocal.plugin]
})

export default store
