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

const sku = {
  state: {
    editingSku: {},
    editingPage: [],
    editingSkus: []
  },

  mutations: {
    setSku: (state, sku) => {
      let editingSkus = state.editingSkus.filter(
        (item) => item.item_spec.length == sku.item_spec.length
      )
      let current = state.editingSkus.findIndex((item) => item.sku_id === sku.sku_id)
      if (current === -1) {
        editingSkus.push(sku)
        state.editingSkus = editingSkus
      } else {
        Object.assign(editingSkus[current], sku)
        state.editingSkus = editingSkus
      }
    },
    setPage: (state, list) => {
      state.editingPage = list
      list.forEach((issue) => {
        let isin = state.editingSkus.findIndex((item) => item.sku_id === issue.sku_id)
        if (isin === -1) {
          state.editingSkus.push(issue)
        } else {
          Object.assign(state.editingSkus[isin], issue)
        }
      })
    },
    removeSku: (state, sku) => {
      let current = state.editingSkus.findIndex((item) => item.sku_id === sku.sku_id)
      let pageCurrent = state.editingPage.findIndex((item) => item.sku_id === sku.sku_id)
      if (current !== -1) {
        state.editingSkus.splice(current, 1)
      }
      if (pageCurrent !== -1) {
        state.editingPage.splice(pageCurrent, 1)
      }
    },
    clearSkus: (state) => {
      state.editingSkus = []
    },
    clearPage: (state) => {
      state.editingPage = []
    }
  },

  actions: {
    setSku({ commit }, sku) {
      commit('setSku', sku)
    },
    setPage({ commit }, sku) {
      commit('setPage', sku)
    },
    removeSku({ commit }, sku) {
      commit('removeSku', sku)
    },
    clearSkus({ commit }) {
      commit('clearSkus')
      commit('clearPage')
    }
  },

  getters: {
    editingSkus(state) {
      return state.editingSkus
    }
  }
}

export default sku
