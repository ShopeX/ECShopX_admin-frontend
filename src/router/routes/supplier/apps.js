// 应用路由
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'supplierapplications',
      icon: 'app-store',
      keepAlive: true,
      title: '应用'
    },
    name: 'supplierapplications',
    path: '/supplier/applications',
    children: [
      {
        name: 'bspayUser',
        path: 'bspay/user',
        component: () => import('@/view/mall/marketing/huifuBspay'),
        meta: {
          aliasName: 'supplierapplicationsbspayuser_audit',
          icon: 'icon-user',
          title: '进件管理',
          permissions: [
            'supplierapplications.supplierapplicationsbspay.supplierapplicationsbspayuser_audit'
          ]
        },
        children: [
          {
            path: 'approve/:order_id',
            component: () => import('@/view/mall/marketing/huifuBspay/approve'),
            meta: {
              title: '进件管理详情',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'bspayTrades',
        path: 'bspay/trades',
        component: () => import('@/view/mall/bspay_sub_account/sub_account'),
        meta: {
          aliasName: 'supplierapplicationsbspaytrades',
          icon: 'icon-trades',
          title: '分账明细',
          permissions: [
            'supplierapplications.supplierapplicationsbspay.supplierapplicationsbspaytrades'
          ]
        },
        children: [
          {
            path: 'detail/:order_id',
            component: () => import('@/view/mall/bspay_sub_account/detail'),
            meta: {
              title: '分账明细详情',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
