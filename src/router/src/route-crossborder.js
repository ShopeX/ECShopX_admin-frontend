// 跨境
const name = '跨境'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/crossborder',
  component: Layout,
  children: [
    {
      path: 'origincountry',
      name: `产地国`,
      component: () => import('@/view/crossborder/origincountry/list')
    },
    {
      path: 'crossbordersetinfo',
      name: `跨境设置`,
      component: () => import('@/view/crossborder/crossborderset/info')
    },
    {
      path: 'godsphysicalkj',
      name: `商品管理`,
      component: () => import('@/view/mall/goods/physical/list'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/goods/physical/add')
        }
      ]
    },
    {
      path: 'taxstrategy',
      name: `税费策略`,
      component: () => import('@/view/crossborder/taxstrategy/list'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/view/crossborder/taxstrategy/edit')
        }
      ]
    }
  ]
}
