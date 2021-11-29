// 商品
const name = '商品'
import Layout from '@/view/layout' // 主框架
import SubLayout from '@/view/sublayout' // 主框架

export default {
  path: '/entity',
  component: Layout,
  children: [
    {
      path: 'goods/goodsphysical',
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
      path: 'goods/goodsaudit',
      name: `商家商品`,
      component: () => import('@/view/mall/goods/audit/list'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/view/mall/goods/audit/add')
        }
      ]
    },
    {
      path: 'goods/goodscategory',
      name: `商品分类`,
      component: () => import('@/view/mall/goods/category')
    },
    {
      path: 'goods/goodsattributes',
      name: `商品规格`,
      component: () => import('@/view/mall/goods/attributes/attributes')
    },
    {
      path: 'goods/goodsparams',
      name: `商品参数`,
      component: () => import( '@/view/mall/goods/attributes/params' )
    },
    {
      path: 'goods/goodsmaincategory',
      name: `商品主类目`,
      component: () => import( '@/view/mall/goods/maincategory' )
    },
    {
      path: 'goods/goodsbrand',
      name: `商品品牌`,
      component: () => import( '@/view/mall/goods/attributes/brand' )
    },
    {
      path: 'goods/itemtags',
      name: `商品标签`,
      component: () => import('@/view/mall/goods/tags')
    },
    {
      path: 'goods/itemstagupload',
      name: `批量打标签`,
      component: () => import('@/view/mall/goods/physical/normalGoodsTagUpload')
    },
    {
      path: 'goods/physicalupload',
      name: `实体商品导入`,
      component: () => import( '@/view/mall/goods/physical/normalGoodsUpload')
    },
    {
      path: 'goods/physicalstoreupload',
      name: `商品库存导入`,
      component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload'),
    },
    {
      path: 'goods/physicalprofitupload',
      name: `商品分润导入`,
      component: () => import('@/view/mall/goods/physical/normalGoodsProfitUpload')
    },
    {
      path: 'goods/rate',
      name: `商品评价`,
      component: () => import('@/view/mall/trade/rate/list')
    },
    {
      path: 'service_goods/servicegoods',
      name: `商品管理`,
      component: () => import( '@/view/mall/goods/service/index' ),
      children: [
        {
          path: 'editor/:itemId?',
          component: () =>
            import( '@/view/mall/goods/service/items/add')
        }
      ]
    },
    {
      path: 'brandmaterial',
      name: `素材管理`,
      component: () => import('@/view/brand/wechat/aterialmanagement'),
      children: [
        {
          path: 'editor/:id?',
          component: () =>
            import( '@/view/brand/wechat/artical/new_artical')
        }
      ]
    },
    {
      path: 'goods/arrivalnotice',
      name: `到货通知`,
      component: () => import('@/view/member/subscribe/goods/list')
    }
  ]
}
