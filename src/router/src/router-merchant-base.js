// 商品路由
const name = '概况'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/merchant',
  component: Layout,
  children: [
    {
      path: '/',
      name: `dashboard`,
      meta: {
        title: `${name}`,
        hidemenu: true
      },
      component: () => import(/* webpackChunkName: "dashboard" */ '@/view/base/merchant_index')
    }
  ]
}
