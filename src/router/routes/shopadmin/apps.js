/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'applications',
      icon: 'app-store',
      keepAlive: true,
      title: '837b3054.5b0520'
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
          title: '837b3054.91287f',
          permissions: ['applications.bspay.bspay_cash_audit']
        },
        component: () => import('@/view/mall/bspay_sub_account/withdraw_audit')
      },
      {
        name: 'dougongWithdraw',
        path: 'dougong/withdraw',
        meta: {
          aliasName: 'dougong_withdraw',
          title: '837b3054.db7971',
          icon: 'pay-circle',
          permissions: ['applications.bspay.bspay_withdraw']
        },
        component: () => import('@/view/mall/bspay_sub_account/withdraw')
      },
      {
        name: 'dougongUserManage',
        path: 'dougong/user-manage',
        component: () => import('@/view/dealer/bspay_create_user'),
        meta: {
          aliasName: 'user',
          icon: 'icon-user',
          title: '837b3054.d38018',
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
          title: '837b3054.85b2f8',
          permissions: ['applications.bspay.trades']
        },
        children: [
          {
            path: 'detail/:order_id',
            component: () => import('@/view/mall/bspay_sub_account/detail'),
            meta: {
              title: '837b3054.ee8348',
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
          title: '837b3054.d38018',
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
          title: '837b3054.98818a',
          permissions: ['applications.adapay.adapay_trades']
        },
        children: [
          {
            path: 'detail/:order_id',
            component: () => import('@/view/mall/sub_account/detail'),
            meta: {
              title: '837b3054.f8f84a',
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
          title: '837b3054.db7971',
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
          title: '837b3054.7d9c7d',
          permissions: ['applications.adapay.adapay_member_info']
        }
      },
      {
        name: 'enterprisePurchaseActivityManagement',
        path: 'enterprise-purchase/activity-management',
        meta: {
          aliasName: 'purchase-admin',
          icon: 'icon-purchase',
          title: '837b3054.d285a2',
          permissions: ['applications.ec.purchase-admin']
        },
        component: () => import('@/view/marketing/employee/list'),
        children: [
          {
            path: 'create/:id?',
            component: () => import('@/view/marketing/employee/purchase'),
            meta: {
              title: '837b3054.725d82',
              hidden: true
            }
          },
          {
            path: 'result/:id',
            component: () => import('@/view/marketing/employee/result'),
            meta: {
              title: '837b3054.d24ac2',
              hidden: true
            }
          },
          {
            path: 'goods/:id',
            component: () => import('@/view/marketing/employee/addGoods'),
            meta: {
              title: '837b3054.fa3aee',
              hidden: true
            }
          },
          {
            path: 'dependents/:id',
            component: () => import('@/view/marketing/employee/dependents'),
            meta: {
              title: '837b3054.b08ef3',
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
          title: '837b3054.07c516',
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
          title: '837b3054.b33603',
          permissions: ['applications.ec.employee-admin']
        },
        children: [
          {
            path: 'import',
            component: () => import('@/view/member/purchase/employeeImport'),
            meta: {
              title: '837b3054.eba44e',
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
          title: '837b3054.afcd11',
          permissions: ['applications.ec.purchase-list']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/trade/order/detail'),
            meta: {
              title: '837b3054.8054f7',
              hidden: true,
              footerFixed: true
            }
          },
          {
            path: 'process/:itemId?',
            component: () => import('@/view/mall/trade/order/process'),
            meta: {
              title: '837b3054.afbe0f',
              hidden: true
            }
          },
          {
            path: 'after-sale/:id?',
            component: () => import('@/view/mall/trade/order/afterSale'),
            meta: {
              title: '837b3054.d9a9d8',
              hidden: true
            }
          },
          {
            path: 'logistics/:itemId?',
            component: () => import('@/view/mall/trade/order/logistics'),
            meta: {
              title: '837b3054.24bc07',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
