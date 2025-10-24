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
      aliasName: 'companydata',
      icon: 'internal-data',
      keepAlive: true,
      title: '数据'
    },
    name: 'data',
    path: '/data',
    children: [
      {
        name: 'productStatistics',
        path: 'statistics/product-statistics',
        meta: {
          aliasName: 'goodsstatistics',
          icon: 'pay-circle',
          title: '商品统计',
          permissions: ['companydata.statistics.goodsstatistics']
        },
        component: () => import('@/view/mall/datacube/goodsdata')
      },
      {
        name: 'transactionStatistics',
        path: 'statistics/transaction-Statistics',
        meta: {
          aliasName: 'orderstatistics',
          icon: 'pay-circle',
          title: '交易统计',
          permissions: ['companydata.statistics.orderstatistics']
        },
        component: () => import('@/view/mall/datacube/companydata/order')
      },
      {
        name: 'membershipStatistics',
        path: 'statistics/membership-Statistics',
        meta: {
          aliasName: 'member-statistics',
          icon: 'pay-circle',
          title: '会员统计',
          permissions: ['companydata.statistics.member-statistics']
        },
        component: () => import('@/view/mall/datacube/companydata/member')
      },
      {
        name: 'storeStatistics',
        path: 'statistics/store-statistics',
        meta: {
          aliasName: 'distributordata',
          icon: 'pay-circle',
          title: '店铺统计',
          permissions: ['companydata.statistics.distributordata']
        },
        component: () => import('@/view/mall/datacube/distributordata')
      },
      {
        name: 'exportRecord',
        path: 'report/export-record',
        meta: {
          aliasName: 'baseexport',
          icon: 'pay-circle',
          title: '导出记录',
          permissions: ['companydata.report.baseexport']
        },
        component: () => import('@/view/base/exportlog/index')
      }
    ]
  }
]

export default routes
