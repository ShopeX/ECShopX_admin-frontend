// 商品路由
const name = '交易管理'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/dealer/trades',
  component: Layout,
  children: [
    {
      path: 'adapay_trades',
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
      path: 'adapay_cash',
      name: `提现`,
      component: () => import('@/view/mall/withdraw/withdraw')
    }
  ]
}
