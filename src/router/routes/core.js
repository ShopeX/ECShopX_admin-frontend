import { AuthPageLayout } from '@/layout'

const coreRoutes = [
  {
    component: AuthPageLayout,
    meta: {
      title: 'Authentication'
    },
    name: 'Authentication',
    path: '/',
    redirect: '/login',
    children: [
      {
        component: () => import('@/views/core/authentication/login.vue'),
        name: 'Login',
        path: 'login'
      }
    ]
  },
  {
    component: AuthPageLayout,
    meta: {
      title: 'Authentication'
    },
    name: 'ShopAdminAuthentication',
    path: '/shopadmin',
    redirect: '/shopadmin/login',
    children: [
      {
        component: () => import('@/views/core/authentication/login.vue'),
        name: 'ShopAdminLogin',
        path: 'login'
      }
    ]
  }
]

export { coreRoutes }
