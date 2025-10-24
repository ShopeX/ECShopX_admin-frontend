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

import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'order',
      icon: 'order',
      keepAlive: true,
      title: '订单'
    },
    name: 'orders',
    path: '/order',
    children: [
      {
        name: `orderManageOrderList`,
        path: 'order-manage/order-list',
        meta: {
          aliasName: 'tradenormalorders',
          icon: 'icon-products',
          title: '订单列表',
          permissions: ['order.entitytrade.tradenormalorders']
        },
        component: () => import('@/view/mall/trade/normalorders/list'),
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
          }
        ]
      },
      {
        name: `selfOrderList`,
        path: 'order-manage/self-order-list',
        component: () => import('@/view/mall/marketing/distributionOrders'),
        meta: {
          aliasName: 'tradenormalshoporders',
          icon: 'icon-products',
          title: '自营订单',
          permissions: ['order.entitytrade.tradenormalshoporders']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/trade/order/detail')
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
          permissions: ['order.entitytrade.normalordersupload']
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
          permissions: ['order.aftersales.aftersaleslist']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/aftersales/detail')
          }
        ]
      },
      {
        name: `orderSetting`,
        path: 'order-manage/order-setting',
        component: () => import('@/view/order/orderSetting'),
        meta: {
          aliasName: 'ordersettingdetail',
          icon: 'icon-products',
          title: '订单配置',
          permissions: ['order.ordersetting.ordersettingdetail']
        }
      },
      {
        name: `giftPackages`,
        path: 'order-manage/gift-packages',
        component: () => import('@/view/order/tradeSetting'),
        meta: {
          aliasName: 'tradesetting',
          icon: 'icon-products',
          title: '礼品包装',
          permissions: ['order.ordersetting.tradesetting']
        }
      },
      {
        name: `afterSalesReason`,
        path: 'order-manage/aftersales-reason',
        component: () => import('@/view/mall/aftersales/reason'),
        meta: {
          aliasName: 'aftersalesreason',
          icon: 'icon-products',
          title: '售后原因',
          permissions: ['order.ordersetting.aftersalesreason']
        }
      },

      // TODO: 路由优化
      {
        name: `cartReminder`,
        path: 'order-manage/cart-reminder',
        component: () => import('@/view/wxapp/cartremind'),
        meta: {
          aliasName: 'cartremind',
          icon: 'icon-products',
          title: '购物提醒',
          permissions: ['order.ordersetting.cartremind']
        }
      },
      {
        name: `purchaseLimit`,
        path: 'order-manage/purchase-limit',
        component: () => import('@/view/member/promotions/goodslimit/list'),
        meta: {
          aliasName: 'goodslimit',
          icon: 'icon-products',
          title: '商品限购',
          permissions: ['order.ordersetting.goodslimit']
        },
        children: [
          {
            path: 'editor/:limit_id?',
            component: () => import('@/view/member/promotions/goodslimit/add')
          }
        ]
      },

      {
        path: 'entitytrade/prescriptionorders',
        name: `处方药订单`,
        component: () => import('@/view/mall/trade/normalorders/prepList'),
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
          }
        ]
      },
      {
        path: 'entitytrade/marketingdistribution-orders',
        name: `店铺订单`,
        meta: {
          aliasName: 'marketingdistribution_orders',
          icon: 'icon-products',
          title: '店铺订单',
          permissions: ['order.entitytrade.marketingdistribution_orders']
        },
        component: () => import('@/view/mall/marketing/distributionOrders'),
        children: [
          {
            path: 'detail',
            component: () => import('@/view/mall/trade/order/detail')
          }
        ]
      },

      {
        name: `tradeOrder`,
        path: 'trade-order',
        component: () => import('@/view/mall/trade/list')
      },
      {
        name: `afterSalesRefundList`,
        path: 'aftersales-refund-list',
        component: () => import('@/view/mall/aftersales/refundList'),
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/aftersales/refundDetail')
          }
        ]
      },
      {
        name: `refundErrorLogs`,
        path: 'refunderrorlogs',
        component: () => import('@/view/mall/trade/refunderrorlogs')
      },
      {
        path: 'chinaums-division-list',
        name: `分账单`,
        component: () => import('@/view/mall/chinaums/divisionList')
      },
      {
        path: 'servicetrade/tradeservice',
        name: `服务订单`,
        component: () => import('@/view/mall/trade/order/list'),
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/trade/order/detail')
          }
        ]
      },
      {
        path: 'servicetrade/tradeverification',
        name: `服务核销单`,
        component: () => import('@/view/mall/trade/salesmanWorkRecords')
      },
      {
        path: 'reservation/mallreservation',
        name: `预约管理`,
        component: () => import('@/view/mall/reservation/resourcesetting/index'),
        children: [
          {
            path: 'editor',
            component: () => import('@/view/mall/reservation/resourcesetting/add')
          }
        ]
      },
      {
        path: 'reservation/reservationsetting',
        name: `预约设置`,
        component: () => import('@/view/mall/reservation/setting/index')
      },
      {
        path: 'reservation/reservationorder',
        name: `预约单`,
        component: () => import('@/view/mall/reservation/resourcesetting/reservation')
      }

      // {
      //   path: 'adapay_trades',
      //   name: '交易单',
      //   component: () => import('@/view/mall/sub_account/sub_account'),
      //   children: [
      //     {
      //       path: 'detail/:order_id',
      //       component: () => import('@/view/mall/sub_account/detail')
      //     }
      //   ]
      // },
    ]
  }
]

export default routes
