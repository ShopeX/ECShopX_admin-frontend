// 商品路由
const name = '店铺'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/dealer/setting',
  component: Layout,
  children: [
    {
      path: 'baseexport',
      name: `导出列表`,
      component: () => import('@/view/base/exportlog/index')
    }
  ]
}
