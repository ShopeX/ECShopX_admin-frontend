/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = 'b369c123.295713'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/dealer/setting',
  component: Layout,
  children: [
    {
      path: 'baseexport',
      name: 'b369c123.d12fb1',
      component: () => import('@/view/base/exportlog/index')
    },
    {
      path: 'account_management',
      name: 'b369c123.b829fe',
      component: () => import('@/view/dealer/account')
    }
  ]
}
