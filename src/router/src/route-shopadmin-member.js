// 商品路由
const name = '会员'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin/member',
  component: Layout,
  children: [
    {
      path: 'member',
      name: `会员列表`,
      component: () => import('@/view/member/members/list'),
      children: [
        {
          path: 'detail/:user_id?',
          component: () => import('@/view/member/members/detail')
        }
      ]
    },
    {
      path: 'Managetag',
      name: `会员标签`,
      component: () => import('@/view/member/members/tags')
    }
  ]
}
