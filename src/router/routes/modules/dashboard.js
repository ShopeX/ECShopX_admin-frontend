/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架
import { i18n } from '@/i18n'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'index',
      icon: 'all-application',
      title: i18n.t('a4b9392f.863853')
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
          title: i18n.t('a4b9392f.863853'),
          permissions: ['index']
        }
      }
    ]
  }
]

export default routes
