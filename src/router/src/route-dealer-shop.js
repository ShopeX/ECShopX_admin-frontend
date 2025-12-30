/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '店铺'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/dealer/distributor',
  component: Layout,
  children: [
    {
      path: 'list',
      name: `店铺管理`,
      component: () => import('@/view/dealer/distributor')
    }
  ]
}
