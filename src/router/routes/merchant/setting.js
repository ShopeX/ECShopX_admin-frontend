// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

// 设置路由
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'setting',
      icon: 'setting-config',
      keepAlive: true,
      title: '设置'
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
          title: '店铺管理员',
          permissions: ['setting.Merchantstaff']
        }
      },
      {
        name: `deliverySettingDistributionManagement`,
        path: 'delivery-setting/deliver-person-management',
        component: () => import('@/view/base/account/delivery'),
        meta: {
          aliasName: 'merchant_setting_staff_selfdeliverystaff',
          icon: 'icon-delivery',
          title: '商户配送员',
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
          title: '账号管理',
          permissions: ['setting.account']
        }
      },
      {
        name: `systemConfigPrivacyApproval`,
        path: 'system-config/provacy-approval',
        component: () => import('@/view/base/setting/authorityapproval'),
        meta: {
          aliasName: 'datapassapply',
          icon: 'icon-apply',
          title: '权限审批',
          permissions: ['setting.datapassapply']
        },
        children: [
          {
            path: 'approve/:id?',
            component: () => import('@/view/base/setting/authorityapproval/approve'),
            meta: {
              title: '审批详情',
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
          title: '导出列表',
          permissions: ['setting.baseexport']
        }
      },
      {
        name: 'operatorLogs',
        path: 'operatorlogs',
        component: () => import('@/view/base/setting/companys/logs'),
        meta: {
          aliasName: 'operatorlogs',
          icon: 'icon-log',
          title: '操作日志',
          permissions: ['setting.operatorlogs']
        }
      },

      // TODO: 路由后期优化
      {
        name: 'dataPassApprove',
        path: 'datapassapprove',
        component: () => import('@/view/base/encrypt/authAdmin.vue'),
        meta: {
          aliasName: 'datapassapprove',
          icon: 'icon-approve',
          title: '权限申请',
          permissions: ['setting.datapassapprove']
        }
      }
    ]
  }
]

export default routes
