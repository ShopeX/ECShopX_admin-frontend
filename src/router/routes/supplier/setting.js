/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'suppliersetting',
      icon: 'setting-config',
      keepAlive: true,
      title: '37753f39.e366cc'
    },
    name: 'supplierSetting',
    path: '/supplier/setting',
    children: [
      {
        name: `exportList`,
        path: 'export/list',
        meta: {
          aliasName: 'baseexport',
          icon: 'icon-products',
          title: '37753f39.d12fb1',
          permissions: ['suppliersetting.baseexport']
        },
        component: () => import('@/view/base/exportlog/index')
      },
      {
        name: `systemConfigPrivacyApply`,
        path: 'system-config/provacy-apply',
        meta: {
          aliasName: 'datapass',
          icon: 'icon-products',
          title: '37753f39.1fb869',
          permissions: ['suppliersetting.datapass']
        },
        component: () => import('@/views/settings/systemConfig/encrypt/authAdmin.vue')
      },
      {
        name: `systemConfigSupplierRegister`,
        path: 'system-config/supplier-register',
        meta: {
          aliasName: 'supplier_register',
          icon: 'icon-products',
          title: '37753f39.1daa33',
          permissions: ['suppliersetting.supplier_register']
        },
        component: () => import('@/view/auth/certify')
      }
    ]
  }
]

export default routes
