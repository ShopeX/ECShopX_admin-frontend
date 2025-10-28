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
      aliasName: 'statistics',
      icon: 'internal-data',
      keepAlive: true,
      title: '数据'
    },
    name: 'data',
    path: '/shopadmin/data',
    children: [
      {
        name: 'storeStatistics',
        path: 'statistics/store-statistics',
        meta: {
          aliasName: 'distributordata',
          icon: 'pay-circle',
          title: '店铺统计',
          permissions: ['statistics.distributordata']
        },
        component: () => import('@/view/mall/datacube/distributordata')
      },
      {
        name: 'settlementSummary',
        path: 'statistics/settlement-summary',
        meta: {
          aliasName: 'summary',
          icon: 'pay-circle',
          title: '结算汇总',
          permissions: ['statistics.settlement.summary']
        },
        component: () => import('@/view/mall/datacube/goodsdata')
      },
      {
        path: 'deliveryStaff',
        name: `statistics/delivery-staff`,
        meta: {
          aliasName: 'shopadmin_statistics_deliverystaffstatistics',
          icon: 'pay-circle',
          title: '配送员业绩',
          permissions: ['statistics.shopadmin_statistics_deliverystaffstatistics']
        },
        component: () => import('@/view/mall/datacube/companydata/delivery')
      }
    ]
  }
]

export default routes
