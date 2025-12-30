/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'rewardsStore',
      icon: 'funds',
      keepAlive: true,
      title: '积分商城'
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
          title: '商品管理',
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
            name: `实体商品导入`,
            component: () => import('@/view/applications/pointmall/goodsImport')
          },
          {
            path: 'physicalstoreupload',
            name: `商品库存导入`,
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
          title: '订单管理',
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
          title: '基础设置',
          permissions: ['rewardsStore.basicSettings']
        },
        component: () => import('@/view/applications/pointmall/setting')
      }
    ]
  }
]

export default routes
