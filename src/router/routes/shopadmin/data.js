/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
