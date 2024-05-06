// 商品路由
const name = '店铺'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin/store',
  component: Layout,
  children: [
    {
      path: 'marketingdistributor',
      name: `店铺信息`,
      component: () => import('@/view/mall/marketing/distributor'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/merchant/store')
        },
        {
          path: 'template/:distributor_id?',
          component: () => import('@/view/mall/marketing/distributor_template')
        },
        {
          path: 'details/:id?',
          component: () => import('@/view/mall/marketing/distributor_details')
        },
        {
          path: 'wxpaysetting',
          component: () => import('@/view/mall/marketing/distributor_wxpaysetting')
        },
        {
          path: 'alipaysetting',
          component: () => import('@/view/mall/marketing/distributor_alipaysetting')
        }
      ]
    },
    {
      path: 'distributorCode',
      name: `店铺码`,
      component: () => import('@/view/mall/marketing/distributorCode')
    },
    {
      path: 'marketingsalesman',
      name: `店铺导购员`,
      component: () => import('@/view/guide/salesman')
    },
    {
      path: 'tmpl/shopDecoration',
      name: `移动商城`,
      component: () => import('@/view/mall/marketing/shopDecoration'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/aftersales/detail')
        }
      ]
    },
    {
      path: 'planting',
      name: `软文`,
      component: () => import('@/view/base/planting/index'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/base/planting/editor')
        }
      ]
    }
  ]
}
