// 商品
const name = '商品'
import Layout from '@/view/layout' // 主框架
import SubLayout from '@/view/sublayout' // 主框架

export default {
  path: '/supplier/entity',
  component: Layout,
  children: [
    // 商品管理
    {
      path: 'goodsphysical',
      name: `商品管理`,
      component: () => import('@/view/mall/goods/physical/list'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/goods/index'),
          meta: {
            footerFixed: true
          }
        },
        {
          path: 'physicalstoreupload',
          name: `库存导入`,
          component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload')
        },
        {
          path: 'physicalprofitupload',
          name: `分润导入`,
          component: () => import('@/view/mall/goods/physical/normalGoodsProfitUpload')
        },
        {
          path: 'physicalupload',
          name: `商品导入`,
          component: () => import('@/view/mall/goods/physical/normalGoodsUpload')
        }
      ]
    },
    {
      path: 'physicalupload',
      name: `商品导入`,
      component: () => import('@/view/mall/goods/physical/normalGoodsUpload')
    },
    {
      path: 'itemtags',
      name: `商品标签`,
      component: () => import('@/view/mall/goods/tags')
    },
    {
      path: 'brandmaterial',
      name: `素材管理`,
      component: () => import('@/view/brand/wechat/aterialmanagement'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/view/brand/wechat/artical/new_artical')
        }
      ]
    }
  ]
}
