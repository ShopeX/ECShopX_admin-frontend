/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = 'f39914ec.295713'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/dealer/distributor',
  component: Layout,
  children: [
    {
      path: 'list',
      name: 'f39914ec.9be38c',
      component: () => import('@/view/dealer/distributor')
    }
  ]
}
