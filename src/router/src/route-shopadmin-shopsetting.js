/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '9e5a95d6.e366cc'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin/shopsetting',
  component: Layout,
  children: [
    {
      path: 'staff/Merchantstaff',
      name: '9e5a95d6.0f2f5b',
      component: () => import('@/view/base/account/storestaff')
    },
    {
      path: 'staff/Merchantstaffroles',
      name: '9e5a95d6.910b4e',
      component: () => import('@/views/settings/role-store')
    },
    {
      path: 'staff/selfdeliverystaff',
      name: '9e5a95d6.3f12ff',
      component: () => import('@/views/settings/deliverySettings/delivery-management')
    },
    {
      path: 'baseexport',
      name: '9e5a95d6.d12fb1',
      component: () => import('@/view/base/exportlog/index')
    },
    {
      path: 'adapay_member',
      name: '9e5a95d6.908152',
      component: () => import('@/view/dealer/create_account.vue')
    },
    {
      path: 'adapay_cash_set',
      name: '9e5a95d6.b33aa1',
      component: () => import('@/view/mall/withdraw/withdraw_setting.vue')
    },
    {
      path: 'datapass/apply',
      name: '9e5a95d6.74236b',
      component: () => import('@/views/settings/systemConfig/encrypt/authAdmin.vue')
    }
  ]
}
