/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '4d4908e4.2685c0'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/order',
  component: Layout,
  children: [
    {
      path: 'entitytrade/tradenormalorders',
      name: '4d4908e4.dbb4d8',
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
      path: 'entitytrade/prescriptionorders',
      name: '4d4908e4.d42283',
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
      path: 'entitytrade/tradenormalshoporders',
      name: '4d4908e4.a509ca',
      component: () => import('@/view/mall/trade/normalorders/shopList'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/trade/order/detail')
        }
      ]
    },
    {
      path: 'entitytrade/marketingdistribution_orders',
      name: '4d4908e4.aae16d',
      component: () => import('@/view/mall/marketing/distributionOrders'),
      children: [
        {
          path: 'detail',
          component: () => import('@/view/mall/trade/order/detail')
        }
      ]
    },
    {
      path: 'aftersales/aftersaleslist',
      name: '4d4908e4.75bfab',
      component: () => import('@/view/mall/aftersales/list'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/aftersales/detail')
        }
      ]
    },

    {
      path: 'entitytrade/normalordersupload',
      name: '4d4908e4.425991',
      component: () => import('@/view/mall/trade/normalorders/ordersupload')
    },
    {
      path: 'servicepayment',
      name: '4d4908e4.8ab066',
      component: () => import('@/view/mall/trade/list')
    },
    {
      path: 'aftersalesrefundlist',
      name: '4d4908e4.51e9e1',
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
      name: '4d4908e4.ea0ea2',
      component: () => import('@/view/mall/trade/refunderrorlogs')
    },
    {
      path: 'chinaumsdivisionlist',
      name: '4d4908e4.fb1213',
      component: () => import('@/view/mall/chinaums/divisionList')
    },
    {
      path: 'servicetrade/tradeservice',
      name: '4d4908e4.cfebe1',
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
      name: '4d4908e4.106f81',
      component: () => import('@/view/mall/trade/salesmanWorkRecords')
    },
    {
      path: 'reservation/mallreservation',
      name: '4d4908e4.220e22',
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
      name: '4d4908e4.0ccaa3',
      component: () => import('@/view/mall/reservation/setting/index')
    },
    {
      path: 'reservation/reservationorder',
      name: '4d4908e4.caa2e5',
      component: () => import('@/view/mall/reservation/resourcesetting/reservation')
    },
    {
      path: 'ordersetting/ordersettingdetail',
      name: '4d4908e4.3b529a',
      component: () => import('@/view/order/orderSetting.vue')
    },
    {
      path: 'ordersetting/aftersalesreason',
      name: '4d4908e4.160adc',
      component: () => import('@/view/mall/aftersales/reason')
    },
    {
      path: 'ordersetting/tradesetting',
      name: '4d4908e4.6d923e',
      component: () => import('@/view/order/tradeSetting')
    },
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
    {
      path: 'ordersetting/cartremind',
      name: '4d4908e4.f6f5b3',
      component: () => import('@/view/wxapp/cartremind')
    },
    {
      path: 'ordersetting/goodslimit',
      name: '4d4908e4.44d46e',
      component: () => import('@/view/member/promotions/goodslimit/list'),
      children: [
        {
          path: 'editor/:limit_id?',
          component: () => import('@/view/member/promotions/goodslimit/add')
        }
      ]
    }
  ]
}
