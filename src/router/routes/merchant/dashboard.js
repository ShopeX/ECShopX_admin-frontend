import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'merchant',
      icon: 'all-application',
      title: '概览'
    },
    path: '/merchant',
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('@/views/dashboard/merchant-dashboard'),
        meta: {
          aliasName: 'merchant',
          icon: 'all-application',
          title: '概览',
          permissions: ['merchant']
        }
      }
    ]
  }
]

export default routes
