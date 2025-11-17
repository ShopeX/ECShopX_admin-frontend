/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '信息管理'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/dealer/adapay_member',
  component: Layout,
  children: [
    // {
    //   path: 'entry',
    //   name: `开户管理`,
    //   component: () => import( '@/view/dealer/create_account.vue' )
    // },
    {
      path: 'info',
      name: `开户信息`,
      component: () => import('@/view/mall/marketing/dealer_accountopen')
    }
  ]
}
