// 商品路由
const name = '店铺'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/dealer/distributor',
  component: Layout,
  children: [
    {
      path: 'list',
      name: `店铺管理`,
      component: () => import('@/view/dealer/distributor')
    }
  ]
}
