/*
 * @Author: your name
 * @Date: 2021-02-22 19:32:36
 * @LastEditTime: 2021-02-22 19:46:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/espier-shop/app/src/store/modules/globalFooter.js
 */

const globalFooter = {
  state: {
    //是否有footer
    isHaveFooter: false,
    //'onlySubmit'-仅有提交按钮
    footerType: undefined,
    //当前form表单的信息
    currentForm: {},
    //当前form表单的名字
    currentFormName: undefined
  },
  mutations: {
    clearFooter: (state) => {
      state.isHavaFooter = false
      state.footerType = undefined
      state.currentForm = {}
      state.currentFormName = undefined
    }
  },
  actions: {
    clearFooter ({ commit }) {
      commit('clearFooter')
    }
  },
  getters: {
    isHaveFooter (state) {
      return state.isHaveFooter
    },
    footerType (state) {
      return state.footerType
    },
    currentForm (state) {
      return state.currentForm
    },
    currentFormName (state) {
      return state.currentFormName
    }
  }
}

export default globalFooter
