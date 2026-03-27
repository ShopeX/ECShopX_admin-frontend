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
      title: '8bb379e9.2685c0'
    },
    name: 'shopadminOrder',
    path: '/shopadmin/order',
    children: [
      {
        name: `orderManageOrderList`,
        path: 'order-manage/order-list',
        component: () => import('@/view/mall/trade/normalorders/list'),
        meta: {
          aliasName: 'shoptradenormalorders',
          icon: 'icon-order',
          title: '8bb379e9.dbb4d8',
          permissions: ['order.shoptradenormalorders']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/trade/order/detail'),
            meta: {
              title: '8bb379e9.8054f7',
              hidden: true
            }
          },
          {
            path: 'process/:itemId?',
            component: () => import('@/view/mall/trade/order/process'),
            meta: {
              title: '8bb379e9.afbe0f',
              hidden: true
            }
          },
          {
            path: 'after-sale/:id?',
            component: () => import('@/view/mall/trade/order/afterSale'),
            meta: {
              title: '8bb379e9.d9a9d8',
              hidden: true
            }
          },
          {
            path: 'logistics/:itemId?',
            component: () => import('@/view/mall/trade/order/logistics'),
            meta: {
              title: '8bb379e9.24bc07',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'tradeOrderList',
        path: 'trade-order',
        component: () => import('@/view/mall/trade/list'),
        meta: {
          aliasName: 'tradepayment',
          icon: 'icon-payment',
          title: '8bb379e9.8ab066',
          permissions: ['order.tradepayment']
        }
      },
      {
        name: 'orderManageAftersalesList',
        path: 'order-manage/aftersales-list',
        component: () => import('@/view/mall/aftersales/list'),
        meta: {
          aliasName: 'aftersaleslist',
          icon: 'icon-aftersales',
          title: '8bb379e9.75bfab',
          permissions: ['order.aftersaleslist']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/aftersales/detail'),
            meta: {
              title: '8bb379e9.70536c',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'aftersalesRefundList',
        path: 'aftersales-refund-list',
        component: () => import('@/view/mall/aftersales/refundList'),
        meta: {
          aliasName: 'aftersalesrefundlist',
          icon: 'icon-refund',
          title: '8bb379e9.51e9e1',
          permissions: ['order.aftersalesrefundlist']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/aftersales/refundDetail'),
            meta: {
              title: '8bb379e9.94b1b9',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'shippingTemplates',
        path: 'shipping-templates',
        component: () => import('@/view/mall/trade/shipping/templates'),
        meta: {
          aliasName: 'shippingtemplates',
          icon: 'icon-shipping',
          title: '8bb379e9.416fd4',
          permissions: ['order.shippingtemplates']
        },
        children: [
          {
            path: 'editor/:templatesId?',
            component: () => import('@/view/mall/trade/shipping/add'),
            meta: {
              title: '8bb379e9.ccbd27',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'logistics',
        path: 'logistics',
        component: () => import('@/views/settings/deliverySettings/logistics/index'),
        meta: {
          aliasName: 'wl-logistics',
          icon: 'icon-logistics',
          title: '8bb379e9.eb6d92',
          permissions: ['order.wl-logistics']
        },
        children: [
          {
            path: 'editor/:id?',
            component: () => import('@/views/settings/deliverySettings/logistics/add-ziti'),
            meta: {
              title: '8bb379e9.cc5959',
              hidden: true
            },
            beforeEnter: ({ params, meta }, from, next) => {
              meta.title = params.id ? 'b51bc270.f36bc9' : 'b51bc270.57eecc'
              next()
            }
          }
        ]
      },

      // TODO: 路由优化

      {
        name: 'chinaumsDivisionList',
        path: 'chinaumsdivisionlist',
        component: () => import('@/view/mall/chinaums/divisionList'),
        meta: {
          aliasName: 'chinaumsdivisionlist',
          icon: 'icon-division',
          title: '8bb379e9.fb1213',
          permissions: ['shopadmin.order.chinaumsdivisionlist']
        }
      },

      {
        name: 'subdistrict',
        path: 'subdistrict',
        component: () => import('@/view/mall/subdistrict/list'),
        meta: {
          aliasName: 'subdistrict',
          icon: 'icon-district',
          title: '8bb379e9.814849',
          permissions: ['shopadmin.order.subdistrict']
        }
      }
    ]
  }
]

export default routes
