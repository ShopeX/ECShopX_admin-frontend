/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin/order',
  component: Layout,
  children: [
    {
      path: 'tradenormalorders',
      name: '9a3d308f.72ab0d',
      component: () => import('@/view/mall/trade/normalorders/list'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/trade/order/detail')
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
      path: 'entitytrade/purchase',
      name: '9a3d308f.d753bc',
      component: () => import('@/view/order/entitytrade/purchase'),
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
      path: 'tradepayment',
      name: '9a3d308f.8ab066',
      component: () => import('@/view/mall/trade/list')
    },
    {
      path: 'aftersaleslist',
      name: '9a3d308f.75bfab',
      component: () => import('@/view/mall/aftersales/list'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/aftersales/detail')
        }
      ]
    },
    {
      path: 'aftersalesrefundlist',
      name: '9a3d308f.51e9e1',
      component: () => import('@/view/mall/aftersales/refundList'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/aftersales/refundDetail')
        }
      ]
    },
    {
      path: 'chinaumsdivisionlist',
      name: '9a3d308f.fb1213',
      component: () => import('@/view/mall/chinaums/divisionList')
    },
    {
      path: 'shippingtemplates',
      name: '9a3d308f.416fd4',
      component: () => import('@/view/mall/trade/shipping/templates'),
      children: [
        {
          path: 'editor/:templatesId?',
          component: () => import('@/view/mall/trade/shipping/add')
        }
      ]
    },
    {
      path: 'logistics',
      name: '9a3d308f.eb6d92',
      // component: () => import('@/view/mall/trade/logistics/normal')
      component: () => import('@/views/settings/deliverySettings/logistics/index'),
      children: [
        {
          path: 'addziti/:id?',
          component: () => import('@/views/settings/deliverySettings/logistics/add-ziti'),
          beforeEnter: ({ params, meta }, from, next) => {
            meta.title = params.id ? 'b51bc270.f36bc9' : 'b51bc270.57eecc'
            next()
          }
        }
      ]
    },
    {
      path: 'subdistrict',
      name: '9a3d308f.814849',
      component: () => import('@/view/mall/subdistrict/list')
    }
  ]
}
