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

// 应用路由
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'applications',
      icon: 'app-store',
      keepAlive: true,
      title: '应用'
    },
    name: 'merchantApplications',
    path: '/merchant/applications',
    children: [
      {
        name: 'adapayWithdrawalAudit',
        path: 'dougong/withdrawal-audit',
        meta: {
          aliasName: 'bspay_cash_audit',
          icon: 'pay-circle',
          title: '提现审核',
          permissions: ['applications.bspay.bspay_cash_audit']
        },
        component: () => import('@/view/mall/bspay_sub_account/withdraw_audit')
      },
      {
        name: 'dougongWithdraw',
        path: 'dougong/withdraw',
        meta: {
          aliasName: 'dougong_withdraw',
          title: '提现',
          icon: 'pay-circle',
          permissions: ['applications.bspay.bspay_withdraw']
        },
        component: () => import('@/view/mall/bspay_sub_account/withdraw')
      },
      {
        name: 'bspayUser',
        path: 'bspay/user',
        component: () => import('@/view/dealer/bspay_create_user'),
        meta: {
          aliasName: 'user',
          icon: 'icon-user',
          title: '进件管理',
          permissions: ['applications.bspay.user']
        }
      },
      {
        name: 'bspayTrades',
        path: 'bspay/trades',
        component: () => import('@/view/mall/bspay_sub_account/sub_account'),
        meta: {
          aliasName: 'bspay_trades',
          icon: 'icon-trades',
          title: '分账明细',
          permissions: ['applications.bspay.bspay_trades']
        },
        children: [
          {
            path: 'detail/:order_id',
            component: () => import('@/view/mall/bspay_sub_account/detail'),
            meta: {
              title: '分账明细详情',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
