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
const name = '交易'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/order',
  component: Layout,
  children: [
    {
      path: 'entitytrade/tradenormalorders',
      name: `全部订单`,
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
      path: 'entitytrade/tradenormalshoporders',
      name: `自营订单`,
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
      name: `店铺订单`,
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
      path: 'entitytrade/normalordersupload',
      name: `批量发货`,
      component: () => import('@/view/mall/trade/normalorders/ordersupload')
    },
    {
      path: 'servicepayment',
      name: `交易单`,
      component: () => import('@/view/mall/trade/list')
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
    },
    {
      path: 'chinaumsdivisionlist',
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
    },
    {
      path: 'ordersetting/ordersettingdetail',
      name: `订单时效配置`,
      component: () => import('@/view/order/orderSetting.vue')
    },
    {
      path: 'ordersetting/aftersalesreason',
      name: `售后原因`,
      component: () => import('@/view/mall/aftersales/reason')
    },
    {
      path: 'ordersetting/tradesetting',
      name: `礼品包装`,
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
      name: `购物车提醒`,
      component: () => import('@/view/wxapp/cartremind')
    },
    {
      path: 'ordersetting/goodslimit',
      name: `商品限购`,
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
