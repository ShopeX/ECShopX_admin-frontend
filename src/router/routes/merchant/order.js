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

// 交易路由
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'order',
      icon: 'order',
      keepAlive: true,
      title: '交易'
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
          title: '实物订单',
          permissions: ['order.tradenormalorders']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/trade/order/detail'),
            meta: {
              title: '订单详情',
              hidden: true
            }
          },
          {
            path: 'process/:itemId?',
            component: () => import('@/view/mall/trade/order/process'),
            meta: {
              title: '订单处理',
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
          title: '售后列表',
          permissions: ['order.aftersaleslist']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/aftersales/detail'),
            meta: {
              title: '售后详情',
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
          title: '交易单',
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
          title: '退款单',
          permissions: ['order.aftersalesrefundlist']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/aftersales/refundDetail'),
            meta: {
              title: '退款详情',
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
          title: '退款失败日志',
          permissions: ['order.Refunderrorlogs']
        }
      }
    ]
  }
]

export default routes
