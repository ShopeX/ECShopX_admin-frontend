/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '设置'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/supplier/setting',
  component: Layout,
  children: [
    {
      path: 'baseexport',
      name: `导出列表`,
      component: () => import('@/view/base/exportlog/index')
    },
    {
      path: 'datapass',
      name: '权限申请',
      component: () => import('@/view/base/encrypt/authAdmin.vue')
    }
  ]
}
