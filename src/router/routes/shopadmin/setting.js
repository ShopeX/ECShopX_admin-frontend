/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'shopsetting',
      icon: 'setting-config',
      keepAlive: true,
      title: '55c94d66.e366cc'
    },
    name: 'setting',
    path: '/shopadmin/setting',
    children: [
      {
        name: `systemAccountStoreAccount`,
        path: 'system-account/store-account',
        meta: {
          aliasName: 'Merchant-staff',
          icon: 'icon-products',
          title: '55c94d66.3282f2',
          permissions: ['shopsetting.distributor-staff.Merchant-staff']
        },
        component: () => import('@/view/base/account/storestaff')
      },
      {
        name: `systemAccountStoreRoles`,
        path: 'system-account/store-roles',
        meta: {
          aliasName: 'platformstaffroles',
          icon: 'icon-products',
          title: '55c94d66.c115e5',
          permissions: ['shopsetting.distributor-staff.platformstaffroles']
        },
        component: () => import('@/view/base/account/storeroles')
      },
      {
        name: `systemAccountDeliveryPersonManagement`,
        path: 'system-account/deliver-person-management',
        meta: {
          aliasName: 'shopadmin_shopsetting_staff_selfdeliverystaff',
          icon: 'icon-products',
          title: '55c94d66.b7765e',
          permissions: [
            'shopsetting.distributor-staff.shopadmin_shopsetting_staff_selfdeliverystaff'
          ]
        },
        component: () => import('@/views/settings/deliverySettings/delivery-management')
      },
      {
        name: `exportList`,
        path: 'export/list',
        meta: {
          aliasName: 'shop-baseexport',
          icon: 'icon-products',
          title: '55c94d66.d12fb1',
          permissions: ['shopsetting.shop-baseexport']
        },
        component: () => import('@/view/base/exportlog/index')
      },
      {
        name: `systemConfigPrivacyApply`,
        path: 'system-config/provacy-apply',
        meta: {
          aliasName: 'applyDataPass',
          icon: 'icon-products',
          title: '55c94d66.1fb869',
          permissions: ['shopsetting.datapass.applyDataPass']
        },
        component: () => import('@/views/settings/systemConfig/encrypt/authAdmin.vue')
      }
    ]
  }
]

export default routes
