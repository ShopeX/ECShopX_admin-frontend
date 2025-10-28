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

// 商品路由
const name = '报表'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin/statistics',
  component: Layout,
  children: [
    {
      path: 'distributordata',
      name: `店铺统计`,
      component: () => import('@/view/mall/datacube/distributordata')
    },
    {
      path: 'deliverystaffstatistics',
      name: `deliverystaffstatistics`,
      meta: {
        title: `${name}-配送员业绩`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-memberstatistics" */ '@/view/mall/datacube/companydata/delivery'
        )
    },
    // {
    //   path: 'accountingStatistics',
    //   name: `店铺分账统计`,
    //   component: () => import( '@/view/mall/splitbill/storeAccount' )
    // },
    {
      path: 'accountingStatistics',
      name: `店铺分账统计`,
      meta: {
        title: `分账统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-accountingStatistics" */ '@/view/mall/datacube/accountingstatistics'
        ),
      children: [
        {
          path: 'detail/:itemId?',
          meta: {
            title: `分账统计-查看`
          },
          component: () =>
            import(
              /* webpackChunkName: "companydata-accountingStatistics-detail" */ '@/view/mall/datacube/accountingstatistics_detail'
            )
        }
      ]
    },
    {
      path: 'cashRecord',
      name: `提现记录`,
      component: () => import('@/view/mall/datacube/cashrecord')
    },
    // {
    //   path: 'accountingStatistics',
    //   name: `accountingStatistics`,
    //   component: () =>import('@/view/mall/splitbill/storeAccount')
    // },
    {
      path: 'financial/settlement/summary',
      name: `结算汇总`,
      component: () => import('@/view/financial/settlement/summary'),
      children: [
        {
          path: 'detail/:id?',
          component: () => import('@/view/financial/settlement/detailed')
        }
      ]
    }
  ]
}
