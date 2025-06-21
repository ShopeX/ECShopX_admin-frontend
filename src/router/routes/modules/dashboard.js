import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'index',
      icon: 'all-application',
      title: '概览'
    },
    path: '/',
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        // component: () => import('@/view/base/index'),
        component: () => import('@/views/dashboard/index'),
        meta: {
          aliasName: 'index',
          icon: 'all-application',
          title: '概览',
          permissions: ['index']
        }
      }
    ]
  }
]

export default routes
