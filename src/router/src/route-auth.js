/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Layout from '@/view/layout' // 主框架
import Home from '@/view/home'

export default [
  {
    path: '/login',
    component: () => import('@/view/auth/login'),
    meta: {
      auth: false,
      type: 'admin'
    },
    name: 'dfac0e4e.b85cc4'
  },
  {
    path: '/shopadmin/login',
    component: () => import('@/view/auth/login'),
    meta: {
      auth: false,
      type: 'distributor'
    },
    name: 'dfac0e4e.d846b2'
  },
  {
    path: '/merchant/login',
    component: () => import('@/view/auth/login'),
    meta: {
      auth: false,
      type: 'merchant'
    },
    name: 'dfac0e4e.b8d9aa'
  },
  {
    path: '/dealer/login',
    component: () => import('@/view/auth/login'),
    meta: {
      auth: false,
      type: 'dealer'
    },
    name: 'dfac0e4e.eea474'
  },
  {
    path: '/shuyunLogin',
    component: () => import('@/view/base/shuyunLogin'),
    meta: {
      auth: false,
      from: 'shuyun'
    },
    name: 'dfac0e4e.4479f7'
  },

  // {
  //   path: '/shopadmin/shoplist',
  //   component: () => import( '@/view/shoplist' )
  // },
  // 激活
  {
    path: '/activelicense',
    component: () => import('@/view/base/asset/accountactivation/index')
  },
  // 营销中线跳转销售中心无权限
  {
    path: '/notExistAuth',
    component: () => import('@/view/notExistAuth')
  },
  // oauth登录回调
  {
    path: '/iframeLogin',
    meta: {
      auth: false
    },
    component: () => import('@/view/base/iframeLogin')
  },
  {
    path: '/auth/:auth_type',
    component: () => import('@/view/authloading'),
    meta: {
      auth: false
    }
  },
  {
    meta: {
      layout: 'empty'
    },
    path: '/wxapp/manage/decorate',
    name: 'dfac0e4e.72c663',
    component: () => import('@/view/decorate/index')
  },
  {
    path: '/wxapp/manage/decorate_pc',
    name: 'dfac0e4e.357db2',
    component: () => import('@/view/decorate/pc/index')
  },
  {
    path: '/supplier/login',
    component: () => import('@/view/auth/login'),
    meta: {
      auth: false,
      type: 'supplier'
    },
    name: 'dfac0e4e.44c6ea'
  },
  {
    path: '/supplier/setting',
    component: Layout,
    children: [
      {
        path: 'supplier_register',
        name: 'dfac0e4e.1daa33',
        component: () => import('@/view/auth/certify')
      }
    ]
  }
]
