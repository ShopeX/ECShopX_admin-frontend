/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'supplierfinancial',
      icon: 'funds',
      keepAlive: true,
      title: '98f1dc59.b8fe8d'
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
          title: '98f1dc59.4c48e9',
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
