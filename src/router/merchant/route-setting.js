/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '0c22b63a.e366cc'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/merchant/setting',
  component: Layout,
  children: [
    {
      path: 'Merchantstaff',
      name: '0c22b63a.0f2f5b',
      component: () => import('@/view/base/account/storestaff')
      // component: () => import('@/view/base/exportlog/index')
    },
    {
      path: 'account',
      name: '0c22b63a.ebea9e',
      component: () => import('@/view/mall/marketing/merchantAccount')
    },
    {
      path: 'staff/selfdeliverystaff',
      name: '0c22b63a.24a85d',
      component: () => import('@/views/settings/deliverySettings/delivery-management')
    },
    {
      path: 'baseexport',
      name: '0c22b63a.d12fb1',
      component: () => import('@/view/base/exportlog/index')
    },

    {
      path: 'operatorlogs',
      name: '0c22b63a.cda84b',
      component: () => import('@/views/settings/systemInfo/operation-log')
    },

    {
      path: 'datapassapprove',
      name: '0c22b63a.74236b',
      component: () => import('@/views/settings/systemConfig/encrypt/authAdmin.vue')
    },
    {
      path: 'datapassapply',
      name: '0c22b63a.54d3e9',
      component: () => import('@/view/base/setting/authorityapproval'),
      children: [
        {
          path: 'approve/:id?',
          component: () => import('@/view/base/setting/authorityapproval/approve')
        }
      ]
    }
  ]
}
