/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'order',
      icon: 'order',
      keepAlive: true,
      title: '031da93d.2685c0'
    },
    name: 'merchantOrder',
    path: '/merchant/order',
    children: [
      {
        name: 'orderManageOrderList',
        path: 'order-manage/order-list',
        component: () => import('@/view/mall/trade/normalorders/list'),
        meta: {
          aliasName: 'tradenormalorders',
          icon: 'icon-order',
          title: '031da93d.72ab0d',
          permissions: ['order.tradenormalorders']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/trade/order/detail'),
            meta: {
              title: '031da93d.8054f7',
              hidden: true
            }
          },
          {
            path: 'process/:itemId?',
            component: () => import('@/view/mall/trade/order/process'),
            meta: {
              title: '031da93d.afbe0f',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'orderManageAftersalesList',
        path: 'order-manage/aftersales-list',
        component: () => import('@/view/mall/aftersales/list'),
        meta: {
          aliasName: 'aftersaleslist',
          icon: 'icon-aftersales',
          title: '031da93d.75bfab',
          permissions: ['order.aftersaleslist']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/aftersales/detail'),
            meta: {
              title: '031da93d.70536c',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'tradeOrder',
        path: 'trade-order',
        component: () => import('@/view/mall/trade/list'),
        meta: {
          aliasName: 'tradepayment',
          icon: 'icon-payment',
          title: '031da93d.8ab066',
          permissions: ['order.tradepayment']
        }
      },
      {
        name: 'afterSalesRefundList',
        path: 'aftersales-refund-list',
        component: () => import('@/view/mall/aftersales/refundList'),
        meta: {
          aliasName: 'aftersalesrefundlist',
          icon: 'icon-refund',
          title: '031da93d.51e9e1',
          permissions: ['order.aftersalesrefundlist']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/aftersales/refundDetail'),
            meta: {
              title: '031da93d.94b1b9',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'refundErrorLogs',
        path: 'refunderrorlogs',
        component: () => import('@/view/mall/trade/refunderrorlogs'),
        meta: {
          aliasName: 'Refunderrorlogs',
          icon: 'icon-error',
          title: '031da93d.ea0ea2',
          permissions: ['order.Refunderrorlogs']
        }
      }
    ]
  }
]

export default routes
