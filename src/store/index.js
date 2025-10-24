// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

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
