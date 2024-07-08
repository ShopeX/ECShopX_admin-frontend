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
        },
        {
          path: 'logistics/:itemId?',
          component: () => import('@/view/mall/trade/order/logistics')
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
      path: 'entitytrade/tradecommunityorders',
      name: `社区团购订单`,
      component: () => import('@/view/mall/trade/normalorders/communityList'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/trade/order/detail')
        },
        {
          path: 'process/:itemId?',
          component: () => import('@/view/mall/trade/order/process')
        }
      ]
    },
    {
      path: 'entitytrade/aftersaleslist',
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
      path: 'entitytrade/logistics',
      name: `物流公司`,
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
      path: 'Ordersetting',
      name: `订单时效配置`,
      component: () => import('@/view/order/orderSetting.vue')
    },
    {
      path: 'kdniao',
      name: `快递跟踪配置`,
      component: () => import('@/view/base/setting/kdniao')
    },
    {
      path: 'sfbsp',
      name: `顺丰物流跟踪设置`,
      component: () => import('@/view/base/setting/sfbsp')
    },
    {
      path: 'Yilianyun',
      name: `易联云配置`,
      component: () => import('@/view/base/setting/yilianyun/index')
    },
    {
      path: 'aftersalesreason',
      name: `售后原因`,
      component: () => import('@/view/mall/aftersales/reason')
    },
    {
      path: 'tradesetting',
      name: `订单包装`,
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
      path: 'adapay_cash',
      name: '提现',
      component: () => import('@/view/mall/withdraw/withdraw')
    },
    {
      path: 'subdistrict',
      name: '街道社区配置',
      component: () => import('@/view/mall/subdistrict/list')
    }
  ]
}
