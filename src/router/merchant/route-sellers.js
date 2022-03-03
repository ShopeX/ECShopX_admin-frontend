// 会员路由
const name = '商家'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/merchant/sellers',
  component: Layout,
  children: [
    {
      path: 'marketingdistributor',
      name: `店铺列表`,
      component: () => import('@/view/mall/marketing/distributor'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/marketing/distributor_editor')
        },
        {
          path: 'template/:distributor_id?',
          component: () => import('@/view/mall/marketing/distributor_template')
        }
      ]
    },
    {
      path: 'merchantinfo',
      name: `商家列表`,
      component: () => import('@/view/mall/marketing/merchantList/editor.vue')
    },
    {
      path: 'distributoraftersalesaddress',
      name: `售后地址`,
      component: () => import('@/view/mall/marketing/distributorAftersalesAddress')
    }
  ]
}
