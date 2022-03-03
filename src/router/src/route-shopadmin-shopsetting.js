// 商品路由
const name = '设置'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin/shopsetting',
  component: Layout,
  children: [
    {
      path: 'baseexport',
      name: `导出列表`,
      component: () => import('@/view/base/exportlog/index')
    },
    {
      path: 'adapay_member',
      name: `开户管理`,
      component: () => import('@/view/dealer/create_account.vue')
    },
    {
      path: 'adapay_cash_set',
      name: '提现设置',
      component: () => import('@/view/mall/withdraw/withdraw_setting.vue')
    },
    {
      path: 'datapass/apply',
      name: '权限申请',
      component: () => import('@/view/base/encrypt/authAdmin.vue')
    }
  ]
}
