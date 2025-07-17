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
    path: '/financial',
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
