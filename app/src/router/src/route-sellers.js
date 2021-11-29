// 会员路由
const name = '商家'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/sellers',
  component: Layout,
  children: [
    {
      path: 'storemanager/marketingdistributor',
      name: `商家列表`,
      component: () => import( '@/view/mall/marketing/distributor' ),
      children: [
        {
          path: 'editor/:itemId?',
          component: () =>
            import( '@/view/mall/marketing/distributor_editor' )
        },
        {
          path: 'template/:distributor_id?',
          component: () =>import('@/view/mall/marketing/distributor_template')
        }
      ]
    },
    {
      path: 'storemanager/distributortags',
      name: `商家标签`,
      component: () => import('@/view/mall/marketing/distributortags' )
    },
    {
      path: 'storemanager/distributoraftersalesaddress',
      name: `售后地址`,
      component: () => import( '@/view/mall/marketing/distributorAftersalesAddress' )
    }
  ]
}
