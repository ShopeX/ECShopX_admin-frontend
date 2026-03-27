/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = 'dc26d9cb.9019dc'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shop_dealer',
  component: Layout,
  children: [
    {
      path: 'dealer_list',
      name: 'dc26d9cb.429487',
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
