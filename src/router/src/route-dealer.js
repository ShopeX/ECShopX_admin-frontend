// 商品路由
const name = '经销商'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shop_dealer',
  component: Layout,
  children: [
    {
      path: 'dealer_list',
      name: `经销商管理`,
      component: () => import('@/view/mall/marketing/dealer'),
      children: [
        {
          path: 'detail/:id?',
          component: () => import('@/view/mall/marketing/dealer/detail'),
          children: [
            {
              path: 'storelist/:id?',
              component: () => import('@/view/mall/marketing/dealer/storelist'),
              children: [
                {
                  path: 'relation/:id?',
                  component: () => import('@/view/mall/marketing/dealer/relationstorelist')
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
