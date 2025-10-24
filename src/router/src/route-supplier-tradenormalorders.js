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

import { IS_SUPPLIER } from '@/utils'

// 交易路由
const name = '交易'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/supplier/order',
  component: Layout,
  children: [
    {
      path: 'tradenormalorders',
      name: `全部订单`,
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
      name: `批量发货`,
      component: () => import('@/view/mall/trade/normalorders/ordersupload')
    },
    {
      path: 'aftersaleslist',
      name: `售后列表`,
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
      name: `运费模板`,
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
      name: `配送管理`,
      component: () => import('@/view/mall/trade/logistics/index')
    },
    {
      path: 'aftersalesrefundlist',
      name: `退款单`,
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
      name: `退款失败日志`,
      component: () => import('@/view/mall/trade/refunderrorlogs')
    }
  ]
}
