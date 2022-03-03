// 交易路由
const name = '交易'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/merchant/order',
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
        }
      ]
    },
    {
      path: 'aftersaleslist',
      name: `售后列表`,
      component: () => import( '@/view/mall/aftersales/list'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import( '@/view/mall/aftersales/detail')
        }
      ]
    },
    {
      path: 'tradepayment',
      name: `交易单`,
      component: () => import('@/view/mall/trade/list')
    },
    {
      path: 'aftersalesrefundlist',
      name: `退款单`,
      component: () => import( '@/view/mall/aftersales/refundList' ),
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
  ]
}
