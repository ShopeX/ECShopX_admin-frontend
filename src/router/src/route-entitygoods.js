// 商品
const name = '商品'
import Layout from '@/view/layout' // 主框架
import SubLayout from '@/view/sublayout' // 主框架

export default {
  path: '/entity',
  component: Layout,
  children: [
    // 商品管理
    {
      path: 'goods/goodsphysical',
      name: `商品管理`,
      component: () => import('@/view/mall/goods/physical/list'),
      children: [
        {
          path: 'editor/:itemId?',
          // component: () => import('@/view/mall/goods/physical/add'),
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
      path: 'goods/goodsaudit',
      name: `商家商品`,
      component: () => import('@/view/mall/goods/audit/list'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/goods/audit/add'),
          meta: {
            footerFixed: true
          }
        }
      ]
    },
    // 基础配置
    {
      path: 'goodsbase/goodscategory',
      name: `销售分类`,
      component: () => import('@/view/mall/goods/category')
    },
    {
      path: 'goodsbase/goodsmaincategory',
      name: `管理分类`,
      component: () => import('@/view/mall/goods/maincategory')
    },
    {
      path: 'goodsbase/goodsattributes',
      name: `商品规格`,
      component: () => import('@/view/mall/goods/attributes/attributes')
    },
    {
      path: 'goodsbase/goodsbrand',
      name: `商品品牌`,
      component: () => import('@/view/mall/goods/attributes/brand')
    },
    {
      path: 'goodsbase/goodsparams',
      name: `商品参数`,
      component: () => import('@/view/mall/goods/attributes/params')
    },
    {
      path: 'goodsbase/itemtags',
      name: `商品标签`,
      component: () => import('@/view/mall/goods/tags')
    },
    {
      path: 'goodsbase/shippingtemplates',
      name: `运费模板`,
      component: () => import('@/view/mall/trade/shipping/templates'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/trade/shipping/add')
        }
      ]
    },
    // 其他服务
    {
      path: 'service/rate',
      name: `商品评价`,
      component: () => import('@/view/goods/rate')
    },
    {
      path: 'service/brandmaterial',
      name: `素材管理`,
      component: () => import('@/view/brand/wechat/aterialmanagement'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/view/brand/wechat/artical/new_artical')
        }
      ]
    },
    {
      path: 'service/arrivalnotice',
      name: `到货通知`,
      component: () => import('@/view/goods/arrivalNotice')
    },

    {
      path: 'goods/itemstagupload',
      name: `批量打标签`,
      component: () => import('@/view/mall/goods/physical/normalGoodsTagUpload')
    },
    {
      path: 'goods/physicalupload',
      name: `实体商品导入`,
      component: () => import('@/view/mall/goods/physical/normalGoodsUpload')
    },

    {
      path: 'service_goods/servicegoods',
      name: `商品管理`,
      component: () => import('@/view/mall/goods/service/index'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/goods/service/items/add')
        }
      ]
    }
  ]
}
