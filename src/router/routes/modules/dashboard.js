import { BasicLayout } from '@/layout/basic' // 主框架

// export default {
//   path: '/',
//   component: BasicLayout,
//   children: [
//     {
//       path: 'dashboard',
//       name: `dashboard`,
//       meta: {
//         // title: `${name}`,
//         hidemenu: true
//       },
//       component: () => import('@/view/base/index')
//     },
//     {
//       path: 'admininfo',
//       name: `dashboard`,
//       meta: {
//         hidemenu: true
//       },
//       component: () => import('@/view/base/shop/admininfo')
//     }
//   ]
// }

const routes = [
  {
    component: BasicLayout,
    meta: {
      icon: 'icon-products',
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
          icon: 'icon-products',
          title: '概览',
          permissions: ['index']
        }
      }
    ]
  }
]

export default routes
