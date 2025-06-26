import { BasicLayout } from '@/layout/basic'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'financial',
      icon: 'funds',
      keepAlive: true,
      title: '财务'
    },
    name: 'financial',
    path: '/financial',
    children: [
      // {
      //   name: 'summary',
      //   path: 'supplier-settlement/summary',
      //   meta: {
      //     aliasName: 'summary_supplier',
      //     icon: 'pay-circle',
      //     title: '供应商结算汇总',
      //     permissions: ['financial.settlement_supplier.summary_supplier']
      //   },
      //   component: () => import('@/'),
      // }
    ]
  }
]

export default routes
