/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '用户信息'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin',
  component: Layout,
  children: [
    {
      path: '',
      name: `dashboard`,
      meta: {
        title: `${name}`,
        hidemenu: true
      },
      component: () => import(/* webpackChunkName: "dashboard" */ '@/view/base/index')
    },
    {
      path: 'admininfo',
      meta: {
        hidemenu: true
      },
      component: () => import('@/view/base/shop/admininfo')
    }
  ]
}
