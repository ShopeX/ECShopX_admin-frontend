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

import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'entity',
      icon: 'commodity',
      keepAlive: true,
      title: '商品'
    },
    name: 'products',
    path: '/products',
    children: [
      {
        name: 'selfProducts',
        path: 'product-manage/self-products',
        component: () => import('@/view/mall/goods/physical/list'),
        meta: {
          aliasName: 'goodsphysical',
          icon: 'icon-products',
          title: '自营商品',
          permissions: ['entity.goods.goodsphysical']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/goods/index'),
            meta: {
              title: '新增商品',
              hidden: true
            }
          },
          {
            path: 'physicalupload/:itemId?',
            component: () => import('@/view/mall/goods/physical/normalGoodsUpload.vue'),
            meta: {
              title: '同步淘宝商品',
              hidden: true
            }
          },
          {
            path: 'stock-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload'),
            meta: {
              title: '库存导入',
              hidden: true
            }
          },
          {
            path: 'profit-sharing-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsProfitUpload'),
            meta: {
              title: '分润导入',
              hidden: true
            }
          },
          {
            path: 'product-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsUpload'),
            meta: {
              title: '商品导入',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'storeProducts',
        path: 'product-manage/store-products',
        component: () => import('@/view/mall/storeshop/store-shop.standard'),
        meta: {
          aliasName: 'storeshopitemanagement',
          icon: 'icon-products',
          title: '门店商品',
          permissions: ['entity.goods.storeshopitemanagement']
        }
      },
      {
        name: 'merchantProducts',
        path: 'product-manage/merchant-products',
        component: () => import('@/view/mall/goods/audit/list'),
        meta: {
          aliasName: 'goodsaudit',
          icon: 'icon-products',
          title: '商户商品',
          permissions: ['entity.goods.goodsaudit']
        },
        children: [
          {
            path: 'editor/:itemId?',
            // component: () => import('@/view/mall/goods/audit/add'),
            component: () => import('@/view/goods/index'),
            meta: {
              icon: 'icon-products',
              title: '商品编辑',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'managementCategory',
        path: 'product-category/management-category',
        component: () => import('@/view/goods/mainCategory'),
        meta: {
          title: '管理分类',
          permissions: ['entity.goodsgroup.goodsmaincategory']
        }
      },
      {
        name: 'saleCategory',
        path: 'product-category/sale-category',
        component: () => import('@/view/goods/saleCategory'),
        meta: {
          title: '销售分类',
          permissions: ['entity.goodsgroup.goodscategory']
        }
      },
      {
        name: 'productTag',
        path: 'product-category/product-tag',
        component: () => import('@/view/mall/goods/tags'),
        meta: {
          title: '商品标签',
          permissions: ['entity.goodsgroup.itemtags']
        }
      },
      {
        name: 'productSku',
        path: 'base-config/product-sku',
        component: () => import('@/view/mall/goods/attributes/attributes'),
        meta: {
          title: '商品规格',
          permissions: ['entity.goodsbase.goodsattributes']
        }
      },
      {
        name: 'minimumOrderQuantity',
        path: 'base-config/minimum-order-quantity',
        component: () => import('@/view/mall/goods/attributes/goodsattributes'),
        meta: {
          title: '起订量',
          permissions: ['entity.goodsbase.goodsstartnum']
        }
      },
      {
        name: 'productBrand',
        path: 'base-config/product-brand',
        component: () => import('@/view/mall/goods/attributes/brand'),
        meta: {
          title: '商品品牌',
          permissions: ['entity.goodsbase.goodsbrand']
        }
      },
      {
        name: 'productParams',
        path: 'base-config/product-params',
        component: () => import('@/view/mall/goods/attributes/params'),
        meta: {
          title: '商品参数',
          permissions: ['entity.goodsbase.goodsparams']
        }
      },
      {
        name: 'exportstoreitems',
        path: 'product-manage/exportstoreitems',
        component: () => import('@/view/mall/marketing/productUpdate'),
        meta: {
          title: '店铺商品更新',
          permissions: ['entity.goods.exportstoreitems']
        }
      }
    ]
  }
]

export default routes
