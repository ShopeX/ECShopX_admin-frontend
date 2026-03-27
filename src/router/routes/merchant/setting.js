/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'setting',
      icon: 'setting-config',
      keepAlive: true,
      title: 'ece0a36b.e366cc'
    },
    name: 'merchantSetting',
    path: '/merchant/setting',
    children: [
      {
        name: `systemAccountStoreAccount`,
        path: 'system-account/store-account',
        component: () => import('@/view/base/account/storestaff'),
        meta: {
          aliasName: 'Merchantstaff',
          icon: 'icon-staff',
          title: 'ece0a36b.3282f2',
          permissions: ['setting.Merchantstaff']
        }
      },
      {
        name: `deliverySettingDistributionManagement`,
        path: 'delivery-setting/deliver-person-management',
        component: () => import('@/views/settings/deliverySettings/delivery-management'),
        meta: {
          aliasName: 'merchant_setting_staff_selfdeliverystaff',
          icon: 'icon-delivery',
          title: 'ece0a36b.c37f09',
          permissions: ['setting.merchant_setting_staff_selfdeliverystaff']
        }
      },
      {
        name: `systemAccountMerchantAccount`,
        path: 'system-account/merchant-account',
        component: () => import('@/view/mall/marketing/merchantAccount'),
        meta: {
          aliasName: 'account',
          icon: 'icon-account',
          title: 'ece0a36b.b829fe',
          permissions: ['setting.account']
        }
      },
      {
        name: `systemConfigPrivacyApproval`,
        path: 'system-config/provacy-approval',
        //component: () => import('@/view/base/setting/authorityapproval'),
        component: () => import('@/views/settings/systemConfig/authorityapproval'),
        meta: {
          aliasName: 'datapassapply',
          icon: 'icon-apply',
          title: 'ece0a36b.54d3e9',
          permissions: ['setting.datapassapply']
        },
        children: [
          {
            path: 'approve/:id?',
            component: () => import('@/views/settings/systemConfig/authorityapproval/approve'),
            meta: {
              title: 'ece0a36b.dad44e',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'baseExport',
        path: 'baseexport',
        component: () => import('@/view/base/exportlog/index'),
        meta: {
          aliasName: 'baseexport',
          icon: 'icon-export',
          title: 'ece0a36b.d12fb1',
          permissions: ['setting.baseexport']
        }
      },
      {
        name: 'operatorLogs',
        path: 'operatorlogs',
        component: () => import('@/views/settings/systemInfo/operation-log'),
        meta: {
          aliasName: 'operatorlogs',
          icon: 'icon-log',
          title: 'ece0a36b.cda84b',
          permissions: ['setting.operatorlogs']
        }
      },

      // TODO: 路由后期优化
      {
        name: 'dataPassApprove',
        path: 'datapassapprove',
        component: () => import('@/views/settings/systemConfig/encrypt/authAdmin.vue'),
        meta: {
          aliasName: 'datapassapprove',
          icon: 'icon-approve',
          title: 'ece0a36b.74236b',
          permissions: ['setting.datapassapprove']
        }
      }
    ]
  }
]

export default routes
