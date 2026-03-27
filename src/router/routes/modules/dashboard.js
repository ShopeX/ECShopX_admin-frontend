/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'index',
      icon: 'all-application',
      title: 'a4b9392f.863853'
    },
    path: '/',
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        // component: () => import('@/view/base/index'),
        component: () => import('@/views/dashboard/index'),
        meta: {
          aliasName: 'index',
          icon: 'all-application',
          title: 'a4b9392f.863853',
          permissions: ['index']
        }
      }
    ]
  }
]

export default routes
