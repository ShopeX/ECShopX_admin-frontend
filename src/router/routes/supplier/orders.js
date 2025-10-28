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
import { IS_SUPPLIER } from '@/utils'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'order',
      icon: 'order',
      keepAlive: true,
      title: '交易'
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
          title: '全部订单',
          permissions: ['order.shoptradenormalorders']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/trade/order/detail'),
            meta: {
              title: '订单详情',
              hidden: true,
              footerFixed: true
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
        name: `batchShipment`,
        path: 'order-manage/batch-shipment',
        component: () => import('@/view/mall/trade/normalorders/ordersupload'),
        meta: {
          aliasName: 'normalordersupload',
          icon: 'icon-products',
          title: '批量发货',
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
          title: '售后列表',
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
          title: '运费模板',
          permissions: ['order.shippingtemplates']
        },
        children: [
          {
            path: 'editor/:itemId?',
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
      {
        name: 'logistics',
        path: 'logistics',
        component: () => import('@/view/mall/trade/logistics/index'),
        meta: {
          aliasName: 'logistics',
          icon: 'icon-logistics',
          title: '配送管理',
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
        path: 'Refunderrorlogs',
        component: () => import('@/view/mall/trade/refunderrorlogs'),
        meta: {
          aliasName: 'order-Refunderrorlogs',
          icon: 'icon-error',
          title: '退款失败日志',
          permissions: ['order.order-Refunderrorlogs']
        }
      }
    ]
  }
]

export default routes
