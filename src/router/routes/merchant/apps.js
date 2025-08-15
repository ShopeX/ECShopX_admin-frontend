// 应用路由
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'applications',
      icon: 'app-store',
      keepAlive: true,
      title: '应用'
    },
    name: 'merchantApplications',
    path: '/merchant/applications',
    children: [
      {
        name: 'adapayWithdrawalAudit',
        path: 'dougong/withdrawal-audit',
        meta: {
          aliasName: 'bspay_cash_audit',
          icon: 'pay-circle',
          title: '提现审核',
          permissions: ['applications.bspay.bspay_cash_audit']
        },
        component: () => import('@/view/mall/bspay_sub_account/withdraw_audit')
      },
      {
        name:'dougongWithdraw',
        path:'dougong/withdraw',
        meta:{
          aliasName:'dougong_withdraw',
          title:'提现',
          icon:'pay-circle',
          permissions:['applications.bspay.bspay_withdraw']
        },
        component:()=>import('@/view/mall/bspay_sub_account/withdraw')
      },
      {
        name: 'bspayUser',
        path: 'bspay/user',
        component: () => import('@/view/dealer/bspay_create_user'),
        meta: {
          aliasName: 'user',
          icon: 'icon-user',
          title: '进件管理',
          permissions: ['applications.bspay.user']
        }
      },
      {
        name: 'bspayTrades',
        path: 'bspay/trades',
        component: () => import('@/view/mall/bspay_sub_account/sub_account'),
        meta: {
          aliasName: 'bspay_trades',
          icon: 'icon-trades',
          title: '分账明细',
          permissions: ['applications.bspay.bspay_trades']
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
