// 商品路由
const name = '经销商'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/dealer/index',
  component: () => import('@/view/dealer/create_account.vue')
}
