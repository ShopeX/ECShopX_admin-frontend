// 商品路由
const name = '应用'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/applications',
  component: Layout,
  children: [
    {
      path: 'adapay/adapay_trades',
      name: '分账明细',
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
      path: 'adapay/adapay_cash_setting',
      name: '提现设置',
      component: () => import('@/view/mall/withdraw/withdraw_setting.vue')
    },
    {
      path: 'adapay/adapay_merchant_info',
      name: `开户信息`,
      component: () => import('@/view/mall/accountopeninfo')
    },
    {
      path: 'adapay/adapay_member_audit',
      name: `开户审批`,
      component: () => import('@/view/mall/marketing/openingapproval'),
      children: [
        {
          path: 'approve/:id?',
          component: () => import('@/view/mall/marketing/openingapproval/approve')
        }
      ]
    },
    {
      path: 'adapay/adapay_merchant',
      name: '商户设置',
      component: () => import('@/view/base/setting/dealer'),
      children: [
        {
          path: '/',
          component: () => import('@/view/base/setting/dealer/account_info')
        },
        {
          path: 'picture',
          component: () => import('@/view/base/setting/dealer/upload_picture')
        },
        {
          path: 'pay_setting',
          component: () => import('@/view/base/setting/dealer/pay_setting')
        },
        {
          path: 'netin',
          component: () => import('@/view/base/setting/dealer/netin')
        }
      ]
    },
    {
      path: 'appsgroup/extapp',
      name: `扩展应用`,
      component: () => import('@/view/applications/appsgroup/extapp')
    }
  ]
}
