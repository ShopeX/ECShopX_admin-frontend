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

// 应用路由
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'supplierapplications',
      icon: 'app-store',
      keepAlive: true,
      title: '应用'
    },
    name: 'supplierapplications',
    path: '/supplier/applications',
    children: [
      {
        name: 'bspayUser',
        path: 'bspay/user',
        component: () => import('@/view/mall/marketing/huifuBspay'),
        meta: {
          aliasName: 'supplierapplicationsbspayuser_audit',
          icon: 'icon-user',
          title: '进件管理',
          permissions: [
            'supplierapplications.supplierapplicationsbspay.supplierapplicationsbspayuser_audit'
          ]
        },
        children: [
          {
            path: 'approve/:order_id',
            component: () => import('@/view/mall/marketing/huifuBspay/approve'),
            meta: {
              title: '进件管理详情',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'bspayTrades',
        path: 'bspay/trades',
        component: () => import('@/view/mall/bspay_sub_account/sub_account'),
        meta: {
          aliasName: 'supplierapplicationsbspaytrades',
          icon: 'icon-trades',
          title: '分账明细',
          permissions: [
            'supplierapplications.supplierapplicationsbspay.supplierapplicationsbspaytrades'
          ]
        },
        children: [
          {
            path: 'detail/:order_id',
            component: () => import('@/view/mall/bspay_sub_account/detail'),
            meta: {
              title: '分账明细详情',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
