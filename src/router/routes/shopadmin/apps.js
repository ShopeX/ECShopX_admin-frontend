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
    name: 'shopadminApplications',
    path: '/shopadmin/applications',
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
        name: 'dougongUserManage',
        path: 'dougong/user-manage',
        component: () => import('@/view/dealer/bspay_create_user'),
        meta: {
          aliasName: 'user',
          icon: 'icon-user',
          title: '进件管理',
          permissions: ['applications.bspay.user']
        }
      },
      {
        name: 'dougongSeparateAccountDetail',
        path: 'dougong/separate-account-detail',
        component: () => import('@/view/mall/bspay_sub_account/sub_account'),
        meta: {
          aliasName: 'trades',
          icon: 'icon-trades',
          title: '分账明细',
          permissions: ['applications.bspay.trades']
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
      },

      {
        name: 'adapayMemberEntry',
        path: 'adapay/member-entry',
        component: () => import('@/view/dealer/create_account'),
        meta: {
          aliasName: 'adapay_member_entry',
          icon: 'icon-entry',
          title: '进件管理',
          permissions: ['applications.adapay.adapay_member_entry']
        }
      },
      {
        name: 'adapaySeparateAccountDetail',
        path: 'adapay/separate-account-detail',
        component: () => import('@/view/mall/sub_account/sub_account'),
        meta: {
          aliasName: 'adapay_trades',
          icon: 'icon-trades',
          title: '分账',
          permissions: ['applications.adapay.adapay_trades']
        },
        children: [
          {
            path: 'detail/:order_id',
            component: () => import('@/view/mall/sub_account/detail'),
            meta: {
              title: '分账详情',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'adapayWithdrawal',
        path: 'adapay/withdrawal',
        component: () => import('@/view/mall/withdraw/withdraw'),
        meta: {
          aliasName: 'adapay_cash',
          icon: 'icon-cash',
          title: '提现',
          permissions: ['applications.adapay.adapay_cash']
        }
      },
      {
        name: 'adapayMemberInfo',
        path: 'adapay/adapay-member-info',
        component: () => import('@/view/mall/marketing/distributor_details'),
        meta: {
          aliasName: 'adapay_member_info',
          icon: 'icon-info',
          title: '进件信息',
          permissions: ['applications.adapay.adapay_member_info']
        }
      },
      {
        name: 'enterprisePurchaseActivityManagement',
        path: 'enterprise-purchase/activity-management',
        meta: {
          aliasName: 'purchase-admin',
          icon: 'icon-purchase',
          title: '活动管理',
          permissions: ['applications.ec.purchase-admin']
        },
        component: () => import('@/view/marketing/employee/list'),
        children: [
          {
            path: 'create/:id?',
            component: () => import('@/view/marketing/employee/purchase'),
            meta: {
              title: '创建内购活动',
              hidden: true
            }
          },
          {
            path: 'result/:id',
            component: () => import('@/view/marketing/employee/result'),
            meta: {
              title: '内购活动结果',
              hidden: true
            }
          },
          {
            path: 'goods/:id',
            component: () => import('@/view/marketing/employee/addGoods'),
            meta: {
              title: '添加商品',
              hidden: true
            }
          },
          {
            path: 'dependents/:id',
            component: () => import('@/view/marketing/employee/dependents'),
            meta: {
              title: '家属管理',
              hidden: true
            }
          }
        ]
      },

      {
        name: 'enterprisePurchaseManagement',
        path: 'enterprise-purchase/enterprise-management',
        component: () => import('@/view/member/purchase/company'),
        meta: {
          aliasName: 'company-admin',
          icon: 'icon-company',
          title: '企业管理',
          permissions: ['applications.ec.company-admin']
        }
      },
      {
        name: 'enterprisePurchaseStaffManagement',
        path: 'enterprise-purchase/staff-management',
        component: () => import('@/view/member/purchase/employee'),
        meta: {
          aliasName: 'employee-admin',
          icon: 'icon-employee',
          title: '员工管理',
          permissions: ['applications.ec.employee-admin']
        },
        children: [
          {
            path: 'import',
            component: () => import('@/view/member/purchase/employeeImport'),
            meta: {
              title: '白名单导入',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'enterprisePurchaseActivityOrder',
        path: 'enterprise-purchase/activity-order',
        component: () => import('@/view/order/entitytrade/purchase'),
        meta: {
          aliasName: 'purchase-list',
          icon: 'icon-order',
          title: '订单管理',
          permissions: ['applications.ec.purchase-list']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/trade/order/detail'),
            meta: {
              title: '订单详情',
              hidden: true,
              footerFixed: true
            }
          },
          {
            path: 'process/:itemId?',
            component: () => import('@/view/mall/trade/order/process'),
            meta: {
              title: '订单处理',
              hidden: true
            }
          },
          {
            path: 'after-sale/:id?',
            component: () => import('@/view/mall/trade/order/afterSale'),
            meta: {
              title: '售后服务',
              hidden: true
            }
          },
          {
            path: 'logistics/:itemId?',
            component: () => import('@/view/mall/trade/order/logistics'),
            meta: {
              title: '物流信息',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
