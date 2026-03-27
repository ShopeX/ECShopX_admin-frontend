/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { IS_SUPPLIER } from '@/utils'

// 交易路由
const name = '9fe5c87d.2685c0'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/supplier/order',
  component: Layout,
  children: [
    {
      path: 'tradenormalorders',
      name: '9fe5c87d.dbb4d8',
      component: () => {
        if (IS_SUPPLIER()) {
          return import('@/view/mall/supplier/supplier_orders')
        } else {
          return import('@/view/mall/trade/normalorders/list')
        }
      },
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/trade/order/detail'),
          meta: {
            footerFixed: true
          }
        },
        {
          path: 'process/:itemId?',
          component: () => import('@/view/mall/trade/order/process')
        },
        {
          path: 'after-sale/:id?',
          component: () => import('@/view/mall/trade/order/afterSale')
        },
        {
          path: 'logistics/:itemId?',
          component: () => import('@/view/mall/trade/order/logistics')
        }
      ]
    },
    {
      path: 'normalordersupload',
      name: '9fe5c87d.425991',
      component: () => import('@/view/mall/trade/normalorders/ordersupload')
    },
    {
      path: 'aftersaleslist',
      name: '9fe5c87d.75bfab',
      component: () => import('@/view/mall/aftersales/list'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/aftersales/detail')
        }
      ]
    },
    {
      path: 'shippingtemplates',
      name: '9fe5c87d.416fd4',
      component: () => import('@/view/mall/trade/shipping/templates'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/trade/shipping/add')
        }
      ]
    },
    {
      path: 'logistics',
      name: '9fe5c87d.61b678',
      component: () => import('@/views/settings/deliverySettings/logistics/index'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/views/settings/deliverySettings/logistics/add-ziti')
        }
      ]
    },
    {
      path: 'aftersalesrefundlist',
      name: '9fe5c87d.51e9e1',
      component: () => import('@/view/mall/aftersales/refundList'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/aftersales/refundDetail')
        }
      ]
    },
    {
      path: 'Refunderrorlogs',
      name: '9fe5c87d.ea0ea2',
      component: () => import('@/view/mall/trade/refunderrorlogs')
    }
  ]
}
