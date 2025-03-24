// 商品
const name = '商品'
import Layout from '@/view/layout' // 主框架
import SubLayout from '@/view/sublayout' // 主框架

export default {
  path: '/entity',
  component: Layout,
  children: [
    // 自营商品
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
      path: 'goods/storeshopitemanagement',
      name: `店铺商品`,
      // component: () => import('@/view/mall/storeshop/itemlist')
      component: () => import('@/view/mall/storeshop/store-shop.standard')
    },
    // 供应商商品列表
    {
      path: 'goods/supplier_goods_list',
      name: `供应商商品列表`,
      component: () => import('@/view/mall/goods/physical/supplier_goods_list'),
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
    // 供应商商品审核
    {
      path: 'goods/suppliergoods',
      name: `供应商商品审核`,
      component: () => import('@/view/mall/goods/physical/supplier_goods_check'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/goods/index'),
          meta: {
            footerFixed: true
          }
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
    // 商品分类
    {
      path: 'goodsgroup/goodscategory',
      name: `销售分类`,
      // component: () => import('@/view/mall/goods/category')
      component: () => import('@/view/goods/saleCategory')
    },
    {
      path: 'goodsgroup/goodsmaincategory',
      name: `管理分类`,
      // component: () => import('@/view/mall/goods/maincategory')
      component: () => import('@/view/goods/mainCategory')
    },
    {
      path: 'goodsgroup/itemtags',
      name: `商品标签`,
      component: () => import('@/view/mall/goods/tags')
    },
    // 基础设置
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
