// 商品路由
const name = '应用'
import Layout from '@/view/layout' // 主框架
import SubLayout from '@/view/sublayout' //

export default {
  path: '/shopadmin/applications',
  component: Layout,
  children: [
    {
      path: 'adapay/adapay_member_entry',
      name: '进件管理',
      component: () => import('@/view/dealer/create_account')
    },
    {
      path: 'adapay/adapay_trades',
      name: '分账',
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
      name: '提现',
      component: () => import('@/view/mall/withdraw/withdraw')
    },
    {
      path: 'adapay/adapay_member_info',
      name: '进件信息',
      component: () => import('@/view/mall/marketing/distributor_details')
    },
    {
      path: 'bspay/user',
      name: '进件管理',
      component: () => import('@/view/dealer/bspay_create_user')
    },
    {
      path: 'bspay/trades',
      name: '分账明细',
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
      name: `员工内购`,
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
      name: '员工管理',
      component: () => import('@/view/member/purchase/employee'),
      children: [
        {
          path: 'import',
          name: `白名单导入`,
          component: () => import('@/view/member/purchase/employeeImport')
        }
      ]
    },
    {
      path: 'ec/company',
      name: '企业管理',
      component: () => import('@/view/member/purchase/company')
    },
    {
      path: 'ec/purchaseorder',
      name: `内购订单`,
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
