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

// 商品路由
const name = '商品'
import Layout from '@/view/layout' // 主框架
import { IS_DISTRIBUTOR } from '@/utils'

export default {
  path: '/shopadmin/entity',
  component: Layout,
  children: [
    {
      path: 'goodsphysical',
      name: `商品管理`,
      component: () => import('@/view/mall/goods/physical/list'),
      children: [
        {
          path: 'editor/:itemId?',
          // component: () => import('@/view/mall/goods/physical/add')
          component: () => import('@/view/goods/index')
        },
        {
          path: 'physicalupload',
          name: `商品导入`,
          component: () => import('@/view/mall/goods/physical/normalGoodsUpload')
        },
        {
          path: 'physicalstoreupload',
          name: `库存导入`,
          component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload')
        }
      ]
    },
    {
      path: 'storeshopproductanagement',
      name: `商品管理`,
      component: () => import('@/view/mall/goods/physical/list.standard'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/goods/physical/add')
          // component: () => {
          //   if(IS_DISTRIBUTOR()) {
          //     return import('@/view/mall/goods/physical/add.standard')
          //   } else {
          //     return import('@/view/mall/goods/physical/add')
          //   }
          // }
        },
        {
          path: 'physicalupload',
          name: `商品导入`,
          component: () => import('@/view/mall/goods/physical/normalGoodsUpload')
        }
      ]
    },
    {
      path: 'rate',
      name: `商品评价`,
      component: () => import('@/view/goods/rate')
    },
    {
      path: 'goodsbrand',
      name: `商品品牌`,
      component: () => import('@/view/mall/goods/attributes/brand')
    },
    {
      path: 'goodscategory',
      name: `店铺分类`,
      // component: () => import('@/view/mall/goods/category')
      component: () => import('@/view/goods/saleCategory')
    },
    {
      path: 'itemtags',
      name: `商品标签`,
      component: () => import('@/view/mall/goods/tags')
    },
    // {
    //   path: 'brandmaterial',
    //   name: `素材管理`,
    //   component: () => import('@/view/brand/wechat/artical/new_artical')
    // },
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
    },
    {
      path: 'physicalupload',
      name: `商品导入`,
      component: () => import('@/view/mall/goods/physical/normalGoodsUpload')
    },
    {
      path: 'popularizegoods',
      name: `商品分销池`,
      component: () => import('@/view/popularize/goods')
    }
  ]
}
