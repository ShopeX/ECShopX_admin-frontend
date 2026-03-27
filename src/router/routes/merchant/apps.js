/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'applications',
      icon: 'app-store',
      keepAlive: true,
      title: '4f279119.5b0520'
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
          title: '4f279119.91287f',
          permissions: ['applications.bspay.bspay_cash_audit']
        },
        component: () => import('@/view/mall/bspay_sub_account/withdraw_audit')
      },
      {
        name: 'dougongWithdraw',
        path: 'dougong/withdraw',
        meta: {
          aliasName: 'dougong_withdraw',
          title: '4f279119.db7971',
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
          title: '4f279119.d38018',
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
          title: '4f279119.85b2f8',
          permissions: ['applications.bspay.bspay_trades']
        },
        children: [
          {
            path: 'detail/:order_id',
            component: () => import('@/view/mall/bspay_sub_account/detail'),
            meta: {
              title: '4f279119.ee8348',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
