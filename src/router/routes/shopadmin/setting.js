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
      title: '设置'
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
          title: '店铺管理员',
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
          title: '店铺角色',
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
          title: '配送员',
          permissions: [
            'shopsetting.distributor-staff.shopadmin_shopsetting_staff_selfdeliverystaff'
          ]
        },
        component: () => import('@/view/base/account/delivery')
      },
      {
        name: `exportList`,
        path: 'export/list',
        meta: {
          aliasName: 'shop-baseexport',
          icon: 'icon-products',
          title: '导出列表',
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
          title: '脱敏数据申请',
          permissions: ['shopsetting.datapass.applyDataPass']
        },
        component: () => import('@/view/base/encrypt/authAdmin.vue')
      }
    ]
  }
]

export default routes
