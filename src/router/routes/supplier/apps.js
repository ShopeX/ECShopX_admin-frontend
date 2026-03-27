/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'supplierapplications',
      icon: 'app-store',
      keepAlive: true,
      title: 'df3e4f24.5b0520'
    },
    name: 'supplierApplications',
    path: '/supplier/applications',
    children: [
      {
        name: 'dougongUserManage',
        path: 'dougong/user-manage',
        component: () => import('@/view/dealer/bspay_create_user'),
        meta: {
          aliasName: 'user',
          icon: 'icon-user',
          title: 'df3e4f24.d38018',
          permissions: ['supplierapplications.supplierapplicationsbspay.user']
        }
      },
      {
        name: 'dougongSeparateAccountDetail',
        path: 'dougong/separate-account-detail',
        component: () => import('@/view/mall/bspay_sub_account/sub_account'),
        meta: {
          aliasName: 'trades',
          icon: 'icon-trades',
          title: 'df3e4f24.85b2f8',
          permissions: ['supplierapplications.supplierapplicationsbspay.trades']
        },
        children: [
          {
            path: 'detail/:order_id',
            component: () => import('@/view/mall/bspay_sub_account/detail'),
            meta: {
              title: 'df3e4f24.ee8348',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
