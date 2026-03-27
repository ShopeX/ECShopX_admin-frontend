/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架
import { IS_SUPPLIER } from '@/utils'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'order',
      icon: 'order',
      keepAlive: true,
      title: '8c6c4a89.2685c0'
    },
    name: 'supplierOrder',
    path: '/supplier/order',
    children: [
      {
        name: `orderManageOrderList`,
        path: 'order-manage/order-list',
        component: () => import('@/view/mall/supplier/supplier_orders'),
        meta: {
          aliasName: 'shoptradenormalorders',
          icon: 'icon-order',
          title: '8c6c4a89.dbb4d8',
          permissions: ['order.shoptradenormalorders']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/trade/order/detail'),
            meta: {
              title: '8c6c4a89.8054f7',
              hidden: true,
              footerFixed: true
            }
          },
          {
            path: 'process/:itemId?',
            component: () => import('@/view/mall/trade/order/process'),
            meta: {
              title: '8c6c4a89.afbe0f',
              hidden: true
            }
          },
          {
            path: 'after-sale/:id?',
            component: () => import('@/view/mall/trade/order/afterSale'),
            meta: {
              title: '8c6c4a89.d9a9d8',
              hidden: true
            }
          },
          {
            path: 'logistics/:itemId?',
            component: () => import('@/view/mall/trade/order/logistics'),
            meta: {
              title: '8c6c4a89.24bc07',
              hidden: true
            }
          }
        ]
      },
      {
        name: `batchShipment`,
        path: 'order-manage/batch-shipment',
        component: () => import('@/view/mall/trade/normalorders/ordersupload'),
        meta: {
          aliasName: 'normalordersupload',
          icon: 'icon-products',
          title: '8c6c4a89.425991',
          permissions: ['order.normalordersupload']
        }
      },
      {
        name: `afterSalesList`,
        path: 'order-manage/aftersales-list',
        component: () => import('@/view/mall/aftersales/list'),
        meta: {
          aliasName: 'aftersaleslist',
          icon: 'icon-products',
          title: '8c6c4a89.75bfab',
          permissions: ['order.aftersaleslist']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/aftersales/detail')
          }
        ]
      },
      {
        name: 'shippingTemplates',
        path: 'shippingtemplates',
        component: () => import('@/view/mall/trade/shipping/templates'),
        meta: {
          aliasName: 'shippingtemplates',
          icon: 'icon-shipping',
          title: '8c6c4a89.416fd4',
          permissions: ['order.shippingtemplates']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/mall/trade/shipping/add'),
            meta: {
              title: '8c6c4a89.ccbd27',
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
          title: '8c6c4a89.eb6d92',
          permissions: ['order.wl-logistics']
        },
        children: [
          {
            path: 'editor/:id?',
            component: () => import('@/views/settings/deliverySettings/logistics/add-ziti'),
            meta: {
              title: '8c6c4a89.cc5959',
              hidden: true
            },
            beforeEnter: ({ params, meta }, from, next) => {
              meta.title = params.id ? 'b51bc270.f36bc9' : 'b51bc270.57eecc'
              next()
            }
          }
        ]
      },
      {
        name: 'logistics',
        path: 'logistics',
        component: () => import('@/views/settings/deliverySettings/logistics/index'),
        meta: {
          aliasName: 'logistics',
          icon: 'icon-logistics',
          title: '8c6c4a89.61b678',
          permissions: ['order.logistics']
        }
      },
      {
        name: 'aftersalesRefundList',
        path: 'aftersalesrefundlist',
        component: () => import('@/view/mall/aftersales/refundList'),
        meta: {
          aliasName: 'aftersalesrefundlist',
          icon: 'icon-refund',
          title: '8c6c4a89.51e9e1',
          permissions: ['order.aftersalesrefundlist']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/aftersales/refundDetail'),
            meta: {
              title: '8c6c4a89.94b1b9',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'refundErrorLogs',
        path: 'Refunderrorlogs',
        component: () => import('@/view/mall/trade/refunderrorlogs'),
        meta: {
          aliasName: 'order-Refunderrorlogs',
          icon: 'icon-error',
          title: '8c6c4a89.ea0ea2',
          permissions: ['order.order-Refunderrorlogs']
        }
      }
    ]
  }
]

export default routes
