/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '应用'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/merchant/applications',
  component: Layout,
  children: [
    {
      path: 'bspay/user',
      name: '进件管理',
      component: () => import('@/view/dealer/bspay_create_user')
    },
    {
      path: 'bspay/trades',
      name: '分账明细',
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
