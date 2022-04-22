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
      component: () => import('@/view/mall/trade/logistics/normal')
    },
    {
      path: 'adapay_trades',
      name: '分账',
      component: () => import('@/view/mall/sub_account/sub_account'),
      children: [
        {
          path: 'detail/:order_id',
          component: () => import('@/view/mall/sub_account/detail')
        }
      ]
    },
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
