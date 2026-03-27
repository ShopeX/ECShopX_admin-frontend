/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = 'dd2b0faa.5b0520'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/merchant/applications',
  component: Layout,
  children: [
    {
      path: 'bspay/user',
      name: 'dd2b0faa.d38018',
      component: () => import('@/view/dealer/bspay_create_user')
    },
    {
      path: 'bspay/trades',
      name: 'dd2b0faa.85b2f8',
      component: () => import('@/view/mall/bspay_sub_account/sub_account'),
      children: [
        {
          path: 'detail/:order_id',
          component: () => import('@/view/mall/bspay_sub_account/detail')
        }
      ]
    }
  ]
}
