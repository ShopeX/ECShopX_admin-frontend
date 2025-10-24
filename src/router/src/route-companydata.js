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

// 会员路由
const name = '统计'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/companydata',
  component: Layout,
  children: [
    {
      path: 'statistics/goodsstatistics',
      name: `goodsstatistics`,
      meta: {
        title: `${name}-商品统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-goodsstatistics" */ '@/view/mall/datacube/goodsdata'
        )
    },
    {
      path: 'statistics/orderstatistics',
      name: `orderstatistics`,
      meta: {
        title: `${name}-交易统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-orderstatistics" */ '@/view/mall/datacube/companydata/order'
        )
    },
    {
      path: 'statistics/distributordata',
      name: `distributordata`,
      meta: {
        title: `${name}-店铺统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-distributordata" */ '@/view/mall/datacube/distributordata'
        )
    },
    {
      path: 'statistics/memberstatistics',
      name: `memberstatistics`,
      meta: {
        title: `${name}-会员统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-memberstatistics" */ '@/view/mall/datacube/companydata/member'
        )
    },
    {
      path: 'report/baseexport',
      name: `导出列表`,
      component: () => import('@/view/base/exportlog/index')
    }
  ]
}
