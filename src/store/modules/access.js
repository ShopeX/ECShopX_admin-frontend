/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const accessStore = {
  namespaced: true,
  state: {
    isAccessChecked: false,
    permissions: []
  },
  mutations: {
    // 设置权限
    setPermissions(state, { permissions }) {
      state.permissions = permissions
    },
    setIsAccessChecked(state, playload) {
      state.isAccessChecked = playload
    }
  }
}

export default accessStore
