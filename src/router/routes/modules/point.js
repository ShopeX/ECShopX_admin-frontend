// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

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

    ]
  }
]

export default routes
