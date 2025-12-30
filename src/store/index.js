/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import accessStore from './modules/access'
import userStore from './modules/user'
import systemStore from './modules/system'

import sku from './modules/sku'
import getters from './getters'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  key: '__presist',
  storage: window.localStorage,
  modules: ['user', 'system']
})

const store = new Vuex.Store({
  // 全局状态
  // state: {
  //   productConfig: null
  // },
  modules: {
    access: accessStore,
    user: userStore,
    system: systemStore,
    sku
  },
  getters,
  plugins: [vuexLocal.plugin]
})

export default store
