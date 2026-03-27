/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '2829eafb.5b0520'
import Layout from '@/view/layout' // 主框架
import SubLayout from '@/view/sublayout' //

export default {
  path: '/shopadmin/applications',
  component: Layout,
  children: [
    {
      path: 'adapay/adapay_member_entry',
      name: '2829eafb.d38018',
      component: () => import('@/view/dealer/create_account')
    },
    {
      path: 'adapay/adapay_trades',
      name: '2829eafb.98818a',
      component: () => import('@/view/mall/sub_account/sub_account'),
      children: [
        {
          path: 'detail/:order_id',
          component: () => import('@/view/mall/sub_account/detail')
        }
      ]
    },
    {
      path: 'adapay/adapay_cash',
      name: '2829eafb.db7971',
      component: () => import('@/view/mall/withdraw/withdraw')
    },
    {
      path: 'adapay/adapay_member_info',
      name: '2829eafb.7d9c7d',
      component: () => import('@/view/mall/marketing/distributor_details')
    },
    {
      path: 'bspay/user',
      name: '2829eafb.d38018',
      component: () => import('@/view/dealer/bspay_create_user')
    },
    {
      path: 'bspay/trades',
      name: '2829eafb.85b2f8',
      component: () => import('@/view/mall/bspay_sub_account/sub_account'),
      children: [
        {
          path: 'detail/:order_id',
          component: () => import('@/view/mall/bspay_sub_account/detail')
        }
      ]
    },
    {
      path: 'ec/purchaseactivity',
      name: '2829eafb.6e5918',
      component: SubLayout,
      children: [
        {
          path: '/',
          component: () => import('@/view/marketing/employee/list')
        },
        {
          path: 'create/:id?',
          component: () => import('@/view/marketing/employee/purchase')
        },
        {
          path: 'result/:id',
          component: () => import('@/view/marketing/employee/result')
        },
        {
          path: 'goods/:id',
          component: () => import('@/view/marketing/employee/addGoods')
        },
        {
          path: 'dependents/:id',
          component: () => import('@/view/marketing/employee/dependents')
        }
      ]
      // component: () => import('@/view/member/promotions/purchase/index'),
      // children: [
      //   {
      //     path: 'editor',
      //     component: () => import('@/view/member/promotions/purchase/editor')
      //   },
      //   {
      //     path: 'detail',
      //     component: () => import('@/view/member/promotions/purchase/detail')
      //   },
      //   {
      //     path: 'dependents',
      //     component: () => import('@/view/member/promotions/purchase/dependents')
      //   }
      // ]
    },
    {
      path: 'ec/employee',
      name: '2829eafb.b33603',
      component: () => import('@/view/member/purchase/employee'),
      children: [
        {
          path: 'import',
          name: '2829eafb.eba44e',
          component: () => import('@/view/member/purchase/employeeImport')
        }
      ]
    },
    {
      path: 'ec/company',
      name: '2829eafb.07c516',
      component: () => import('@/view/member/purchase/company')
    },
    {
      path: 'ec/purchaseorder',
      name: '2829eafb.d753bc',
      component: () => import('@/view/order/entitytrade/purchase'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/trade/order/detail'),
          meta: {
            footerFixed: true
          }
        },
        {
          path: 'process/:itemId?',
          component: () => import('@/view/mall/trade/order/process')
        },
        {
          path: 'after-sale/:id?',
          component: () => import('@/view/mall/trade/order/afterSale')
        },
        {
          path: 'logistics/:itemId?',
          component: () => import('@/view/mall/trade/order/logistics')
        }
      ]
    }
  ]
}
