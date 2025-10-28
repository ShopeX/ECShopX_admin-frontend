// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

// 商品
const name = '商品'
import Layout from '@/view/layout' // 主框架
import SubLayout from '@/view/sublayout' // 主框架

export default {
  path: '/merchant/entity',
  component: Layout,
  children: [
    // 商品管理
    {
      path: 'goods/goodsphysical',
      name: `商品管理`,
      component: () => import('@/view/mall/storeshop/store-shop.standard'),
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
      // component: () => import('@/view/mall/goods/category')
      component: () => import('@/view/goods/saleCategory')
    },
    {
      path: 'goodsbase/goodsmaincategory',
      name: `管理分类`,
      // component: () => import('@/view/mall/goods/maincategory')
      component: () => import('@/view/goods/mainCategory')
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
