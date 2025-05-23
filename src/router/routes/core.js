import { AuthPageLayout } from '@/layout'

const coreRoutes = [
  {
    component: AuthPageLayout,
    meta: {
      title: 'Authentication'
    },
    name: 'Authentication',
    path: '/auth',
    redirect: '/auth/login',
    children: [
      {
        component: () => import('@/views/auth/login.vue'),
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
    name: 'Authentication',
    path: '/shopadmin/auth',
    redirect: '/shopadmin/auth/login',
    children: [
      {
        component: () => import('@/views/auth/login.vue'),
        name: 'Login',
        path: 'login'
      }
    ]
  }
]

export { coreRoutes }
