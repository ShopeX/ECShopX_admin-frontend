/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架
import { i18n } from '@/i18n'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'order',
      icon: 'order',
      keepAlive: true,
      title: i18n.t('c15892aa.4c117f')
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
          title: i18n.t('c15892aa.07166e'),
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
          title: i18n.t('c15892aa.a509ca'),
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
          title: i18n.t('c15892aa.425991'),
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
          title: i18n.t('c15892aa.75bfab'),
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
          title: i18n.t('c15892aa.66cd47'),
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
          title: i18n.t('c15892aa.6d923e'),
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
          title: i18n.t('c15892aa.160adc'),
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
          title: i18n.t('c15892aa.b8c40b'),
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
          title: i18n.t('c15892aa.44d46e'),
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
        name: `c15892aa.d42283`,
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
          title: i18n.t('c15892aa.aae16d'),
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
        name: `c15892aa.fb1213`,
        component: () => import('@/view/mall/chinaums/divisionList')
      },
      {
        path: 'servicetrade/tradeservice',
        name: `c15892aa.cfebe1`,
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
        name: `c15892aa.106f81`,
        component: () => import('@/view/mall/trade/salesmanWorkRecords')
      },
      {
        path: 'reservation/mallreservation',
        name: `c15892aa.220e22`,
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
        name: `c15892aa.0ccaa3`,
        component: () => import('@/view/mall/reservation/setting/index')
      },
      {
        path: 'reservation/reservationorder',
        name: `c15892aa.caa2e5`,
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
