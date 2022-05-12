// 社区团购路由
const name = '社区团购'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin/marketing',
  component: Layout,
  children: [
    {
      path: 'community/chief',
      name: `团长管理`,
      component: () => import('@/view/member/cardticket/coupon'),
      children: [
        {
          path: 'editor',
          component: () => import('@/view/member/cardticket/edit')
        },
        {
          path: 'detail',
          component: () => import('@/view/member/cardticket/detail')
        }
      ]
    },
    {
      path: 'community/activity',
      name: `活动管理`,
      component: () => import('@/view/mall/community/activityList')
    },
    {
      path: 'community/communitygoods',
      name: `活动商品`,
      component: () => import('@/view/mall/community/communitygoods')
    },
    {
      path: 'community/order',
      name: `订单管理`,
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
    }
  ]
}
