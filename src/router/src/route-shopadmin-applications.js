// 商品路由
const name = '应用'
import Layout from '@/view/layout' // 主框架

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
    }
  ]
}
