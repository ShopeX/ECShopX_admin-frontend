// 商品路由
const name = '应用'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/applications',
  component: Layout,
  children: [
    {
      path: 'appsgroup/extapp',
      name: `扩展应用`,
      component: () => import('@/view/applications/appsgroup/extapp'),
    }
  ]
}
