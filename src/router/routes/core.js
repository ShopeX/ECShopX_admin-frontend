import { AuthPageLayout } from '@/layout'
import { BasicLayout ,FullLayout} from '@/layout/basic'


/** 全局404页面 */
const fallbackNotFoundRoute = {
  component: FullLayout,
  meta: {
    hideInBreadcrumb: true,
    hideInMenu: true,
    hideInTab: true,
    title: '404'
  },
  // name: 'FallbackNotFound',
  path: '/not-found',
  children: [
    {
      name: 'FallbackNotFound',
      path: '',
      component: () => import('@/views/core/fallback/not-found.vue')
    }
  ]
}

const coreRoutes = [
  {
    component: BasicLayout,
    meta: {
      title: 'Authentication'
    },
    name: 'authentication',
    redirect: '/dashboard', 
    path: '/',
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue')
      }
    ]
  },
  {
    name: 'Login',
    path: '/login',
    component: AuthPageLayout,
    children: [
      {
        name: '/login',
        path: '',
        component: () => import('@/views/core/authentication/login.vue')
      }
    ]
  },
  {
    name: 'shuyunLogin',
    path: '/shuyunLogin',
    component: AuthPageLayout,
    children: [
      {
        name: 'shuyunLogin',
        path: '',
        component: () => import('@/views/core/authentication/shuyun-login.vue')
      }
    ]
  },
  {
    component: AuthPageLayout,
    meta: {
      title: 'shopAdminAuthentication'
    },
    name: 'shopAdminAuthentication',
    path: '/shopadmin',
    children: [
      {
        name: 'shopAdminLogin',
        path: 'login',
        component: () => import('@/views/core/authentication/shop-login.vue')
      }
    ]
  },
  {
    name: 'shopAdminShopList',
    path: '/shopadmin/shoplist',
    component: () => import('@/views/store/shop-list.vue')
  },
  {
    component: AuthPageLayout,
    meta: {
      title: 'supplierAuthentication'
    },
    name: 'supplierAuthentication',
    path: '/supplier',
    children: [
      {
        name: 'supplierLogin',
        path: 'login',
        component: () => import('@/views/core/authentication/supplier-login.vue')
      }
    ]
  },
  {
    component: AuthPageLayout,
    meta: {
      title: 'merchantAuthentication'
    },
    name: 'merchantAuthentication',
    path: '/merchant',
    children: [
      {
        name: 'merchantLogin',
        path: 'login',
        component: () => import('@/views/core/authentication/merchant-login.vue')
      }
    ]
  },
  {
    meta: {
      layout: 'empty',
      title: 'decorate'
    },
    path: '/wxapp/manage/decorate',
    component: () => import('@/view/decorate/index')
  }
]

export { coreRoutes, fallbackNotFoundRoute }
