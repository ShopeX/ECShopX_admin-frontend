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
      aliasName: 'supplierfinancial',
      icon: 'funds',
      keepAlive: true,
      title: '财务'
    },
    name: 'supplierfinancial',
    path: '/supplier/financial',
    children: [
      {
        name: 'supplierSettlementSummary',
        path: 'supplier-settlement/summary',
        meta: {
          aliasName: 'supplierfinancialsettlementsummary_supplier',
          icon: 'pay-circle',
          title: '供应商结算汇总',
          permissions: [
            'supplierfinancial.supplierfinancialsettlement.supplierfinancialsettlementsummary_supplier'
          ]
        },
        component: () => import('@/views/financial/summary_supplier'),
        children: [
          {
            path: 'detail/:id?',
            component: () => import('@/views/financial/detailed')
          }
        ]
      }
    ]
  }
]

export default routes
