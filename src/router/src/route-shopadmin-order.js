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

// 商品路由
const name = '交易'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin/order',
  component: Layout,
  children: [
    {
      path: 'tradenormalorders',
      name: `实物订单`,
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
      name: `内购订单`,
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
      name: `交易单`,
      component: () => import('@/view/mall/trade/list')
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
      path: 'chinaumsdivisionlist',
      name: `分账单`,
      component: () => import('@/view/mall/chinaums/divisionList')
    },
    {
      path: 'shippingtemplates',
      name: `运费模板`,
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
      name: `物流公司`,
      // component: () => import('@/view/mall/trade/logistics/normal')
      component: () => import('@/view/mall/trade/logistics/index'),
      children: [
        {
          path: 'addziti/:id?',
          component: () => import('@/view/mall/trade/logistics/add-ziti'),
          beforeEnter: ({ params, meta }, from, next) => {
            meta.title = params.id ? '编辑自提点' : '新增自提点'
            next()
          }
        }
      ]
    },
    {
      path: 'subdistrict',
      name: '街道社区配置',
      component: () => import('@/view/mall/subdistrict/list')
    }
  ]
}
