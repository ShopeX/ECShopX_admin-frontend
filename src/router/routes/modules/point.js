/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic'
import { i18n } from '@/i18n'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'rewardsStore',
      icon: 'funds',
      keepAlive: true,
      title: i18n.t('a0c3da4f.a13364')
    },
    name: 'rewardsStore',
    path: '/rewardsStore',
    children: [
      {
        name: 'rewardItemManagement',
        path: 'rewardItem',
        meta: {
          aliasName: 'rewardItemManagement',
          icon: 'pay-circle',
          title: i18n.t('a0c3da4f.5782b6'),
          permissions: ['rewardsStore.rewardItemManagement']
        },
        component: () => import('@/view/applications/pointmall/list'),
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/applications/pointmall/add')
          },
          {
            path: 'physicalupload',
            name: `a0c3da4f.0d9697`,
            component: () => import('@/view/applications/pointmall/goodsImport')
          },
          {
            path: 'physicalstoreupload',
            name: `a0c3da4f.e9f31e`,
            component: () => import('@/view/applications/pointmall/storeImport')
          }
        ]
      },
      {
        name: 'rewardordermanagement',
        path: 'rewardorder',
        meta: {
          aliasName: 'rewardordermanagement',
          icon: 'pay-circle',
          title: i18n.t('a0c3da4f.afcd11'),
          permissions: ['rewardsStore.rewardordermanagement']
        },
        component: () => import('@/view/applications/pointmall/orderList'),
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/applications/pointmall/orderDetail')
          }
        ]
      },
      {
        name: 'basicSettings',
        path: 'basic-settings',
        meta: {
          aliasName: 'basicSettings',
          icon: 'pay-circle',
          title: i18n.t('a0c3da4f.0aeca0'),
          permissions: ['rewardsStore.basicSettings']
        },
        component: () => import('@/view/applications/pointmall/setting')
      }
    ]
  }
]

export default routes
