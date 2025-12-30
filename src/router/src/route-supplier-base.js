/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '用户信息'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/supplier',
  component: Layout,
  children: [
    {
      path: 'admininfo',
      meta: {
        hidemenu: true
      },
      component: () => import('@/view/base/shop/admininfo')
    }
  ]
}
