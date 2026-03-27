/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = 'af5ab393.a4883a'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/crossborder',
  component: Layout,
  children: [
    {
      path: 'origincountry',
      name: 'af5ab393.ce304a',
      component: () => import('@/view/crossborder/origincountry/list')
    },
    {
      path: 'crossbordersetinfo',
      name: 'af5ab393.6f0f2c',
      component: () => import('@/view/crossborder/crossborderset/info')
    },
    {
      path: 'godsphysicalkj',
      name: 'af5ab393.5782b6',
      component: () => import('@/view/mall/goods/physical/list'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/goods/physical/add')
        }
      ]
    },
    {
      path: 'taxstrategy',
      name: 'af5ab393.eff9c6',
      component: () => import('@/view/crossborder/taxstrategy/list'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/view/crossborder/taxstrategy/edit')
        }
      ]
    }
  ]
}
