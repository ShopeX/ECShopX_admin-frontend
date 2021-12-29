// 商品路由
import Layout from '@/view/layout' // 主框架
import Home from '@/view/home'

export default [
  {
    path: '/login',
    component: () => import('@/view/auth/login'),
    meta: {
      auth: false
    },
    name: '授权-登录'
  },
  {
    path: '/shopadmin/login',
    component: () => import( '@/view/shoplogin' ),
    meta: {
      auth: false
    },
    name: '授权-店铺登录'
  },
  {
    path: '/merchant/login',
    component: () => import( '@/view/merchantlogin' ),
    meta: {
      auth: false
    },
    name: '授权-商户登陆'
  },
  // {
  //   path:'/dealer/login',
  //   component:()=> import('@/view/auth/login'),
  //   meta:{
  //     auth:false
  //   },
  //   name:'授权-经销商登录'
  // },
  {
    path: '/shopadmin',
    redirect: '/shopadmin/login'
  }, 
  {
    path:'/dealer/login',
    component:()=> import('@/view/auth/dealer_login'),
    meta:{
      auth:false
    },
    name:'授权-经销商登录'
  },
  // {
  //   path: '/shopadmin/shoplist',
  //   component: () => import( '@/view/shoplist' )
  // },
  // 激活
  {
    path: '/activelicense',
    component: () => import( '@/view/base/asset/accountactivation/index' ),
  },
  // 营销中线跳转销售中心无权限
  {
    path: '/notExistAuth',
    component: () => import( '@/view/notExistAuth' )
  },
  // oauth登录回调
  {
    path: '/iframeLogin',
    meta: {
      auth: false
    },
    component: () => import( '@/view/base/iframeLogin' )
  },
  {
    path: '/auth/:auth_type',
    component: () => import('@/view/authloading'),
    meta: {
      auth: false
    }
  }
]
