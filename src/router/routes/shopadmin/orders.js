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
          title: '全部订单',
          permissions: ['order.shoptradenormalorders']
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
          },
          {
            path: 'after-sale/:id?',
            component: () => import('@/view/mall/trade/order/afterSale'),
            meta: {
              title: '售后服务',
              hidden: true
            }
          },
          {
            path: 'logistics/:itemId?',
            component: () => import('@/view/mall/trade/order/logistics'),
            meta: {
              title: '物流信息',
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
          title: '交易单',
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
        name: 'aftersalesRefundList',
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
        name: 'shippingTemplates',
        path: 'shipping-templates',
        component: () => import('@/view/mall/trade/shipping/templates'),
        meta: {
          aliasName: 'shippingtemplates',
          icon: 'icon-shipping',
          title: '运费模板',
          permissions: ['order.shippingtemplates']
        },
        children: [
          {
            path: 'editor/:templatesId?',
            component: () => import('@/view/mall/trade/shipping/add'),
            meta: {
              title: '编辑运费模板',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'logistics',
        path: 'logistics',
        component: () => import('@/view/mall/trade/logistics/index'),
        meta: {
          aliasName: 'wl-logistics',
          icon: 'icon-logistics',
          title: '物流公司',
          permissions: ['order.wl-logistics']
        },
        children: [
          {
            path: 'editor/:id?',
            component: () => import('@/view/mall/trade/logistics/add-ziti'),
            meta: {
              title: '自提点管理',
              hidden: true
            },
            beforeEnter: ({ params, meta }, from, next) => {
              meta.title = params.id ? '编辑自提点' : '新增自提点'
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
          title: '分账单',
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
          title: '街道社区配置',
          permissions: ['shopadmin.order.subdistrict']
        }
      }
    ]
  }
]

export default routes
