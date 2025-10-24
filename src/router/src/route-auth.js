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

// 商品路由
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
    name: '授权-登录'
  },
  {
    path: '/shopadmin/login',
    component: () => import('@/view/auth/login'),
    meta: {
      auth: false,
      type: 'distributor'
    },
    name: '授权-店铺登录'
  },
  {
    path: '/merchant/login',
    component: () => import('@/view/auth/login'),
    meta: {
      auth: false,
      type: 'merchant'
    },
    name: '授权-商户登录'
  },
  {
    path: '/dealer/login',
    component: () => import('@/view/auth/login'),
    meta: {
      auth: false,
      type: 'dealer'
    },
    name: '授权-经销商登录'
  },
  {
    path: '/shuyunLogin',
    component: () => import('@/view/base/shuyunLogin'),
    meta: {
      auth: false,
      from: 'shuyun'
    },
    name: 'shuyun登录'
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
    name: `模板编辑`,
    component: () => import('@/view/decorate/index')
  },
  {
    path: '/wxapp/manage/decorate_pc',
    name: `Pc模板编辑`,
    component: () => import('@/view/decorate/pc/index')
  },
  {
    path: '/supplier/login',
    component: () => import('@/view/auth/login'),
    meta: {
      auth: false,
      type: 'supplier'
    },
    name: '供应商登录'
  },
  {
    path: '/supplier/setting',
    component: Layout,
    children: [
      {
        path: 'supplier_register',
        name: `供应商入驻`,
        component: () => import('@/view/auth/certify')
      }
    ]
  }
]
