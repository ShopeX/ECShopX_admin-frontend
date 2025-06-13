import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'setting',
      icon: 'shopping-bag',
      keepAlive: true,
      title: '设置'
    },
    name: 'setting',
    path: '/setting',
    children: [
      {
        name: `account`,
        path: 'platform/account',
        meta: {
          aliasName: 'Platformstaff',
          icon: 'icon-products',
          title: '平台账号',
          permissions: ['setting.staff.platformstaff']
        },
        component: () => import('@/view/base/account/normalstaff'),
      },
      {
        name: `storeAcount`,
        path: 'store/account',
        meta: {
          aliasName: 'merchantstaff',
          icon: 'icon-products',
          title: '店铺账号',
          permissions: ['setting.staff.merchantstaff']
        },
        component: () => import('@/view/base/account/storestaff'),
      },
      
    ]
  }
]

export default routes

