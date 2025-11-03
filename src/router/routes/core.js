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

import { AuthPageLayout, LicenseLayout } from '@/layout'
import { BasicLayout } from '@/layout/basic'

/** 全局404页面 */
const fallbackNotFoundRoute = {
  component: BasicLayout,
  meta: {
    hideInBreadcrumb: true,
    hideInMenu: true,
    hideInTab: true,
    title: '404'
  },
  // name: 'FallbackNotFound',
  path: '/',
  children: [
    {
      name: 'FallbackNotFound',
      path: 'not-found',
      component: () => import('@/views/core/fallback/not-found.vue')
    }
  ]
}

const coreRoutes = [
  {
    component: AuthPageLayout,
    meta: {
      title: 'Authentication'
    },

    name: 'authentication',
    path: '/',
    children: [
      {
        name: 'Login',
        path: 'login',
        component: () => import('@/views/core/authentication/login.vue')
      },
      {
        name: 'shuyunLogin',
        path: 'shuyunLogin',
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
  },
  {
    path: '/activelicense',
    component: () => import('@/views/core/account-activation.vue')
  },
  {
    path: '/license',
    component: () => import('@/views/license/index')
  }
]

export { coreRoutes, fallbackNotFoundRoute }
