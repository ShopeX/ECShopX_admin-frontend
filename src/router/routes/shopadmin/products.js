/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
    path: '/shopadmin/products',
    children: [
      {
        name: 'productManage',
        path: 'product-manage',
        component: () => import('@/view/mall/goods/physical/list'),
        meta: {
          aliasName: 'goodsphysical',
          icon: 'icon-products',
          title: '自营商品',
          permissions: ['entity.goodsphysical']
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
            path: 'stock-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload'),
            meta: {
              title: '库存导入',
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
        name: `storeProductManage`,
        path: 'store-product-manage',
        component: () => import('@/view/mall/goods/physical/list.standard'),
        meta: {
          aliasName: 'storeshopproductanagement',
          icon: 'icon-products',
          title: '店铺商品',
          permissions: ['entity.storeshopproductanagement']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/goods/index')
          },
          {
            path: 'physicalupload',
            name: `商品导入`,
            component: () => import('@/view/mall/goods/physical/normalGoodsUpload')
          }
        ]
      },
      {
        name: 'productImport',
        path: 'product-import',
        component: () => import('@/view/mall/goods/physical/normalGoodsUpload'),
        meta: {
          aliasName: 'physicalupload',
          icon: 'icon-products',
          title: '商品导入',
          permissions: ['entity.physicalupload']
        }
      },
      {
        name: 'productBrand',
        path: 'product-brand',
        component: () => import('@/view/mall/goods/attributes/brand'),
        meta: {
          aliasName: 'goodsbrand',
          icon: 'icon-products',
          title: '商品品牌',
          permissions: ['entity.goodsbrand']
        }
      },
      {
        name: 'saleCategory',
        path: 'sale-category',
        component: () => import('@/view/goods/saleCategory'),
        meta: {
          aliasName: 'goodsbrand',
          icon: 'icon-products',
          title: '店铺分类',
          permissions: ['entity.goodscategory']
        }
      },
      {
        name: 'productTag',
        path: 'product-tag',
        component: () => import('@/view/mall/goods/tags'),
        meta: {
          aliasName: 'itemtags',
          icon: 'icon-products',
          title: '商品标签',
          permissions: ['entity.itemtags']
        }
      },
      {
        name: `productRate`,
        path: 'product-rate',
        component: () => import('@/view/goods/rate'),
        meta: {
          aliasName: 'rate',
          icon: 'icon-products',
          title: '商品评价',
          permissions: ['entity.rate']
        }
      },
      {
        name: `materialManagement`,
        path: 'material-management',
        component: () => import('@/view/brand/wechat/aterialmanagement'),
        meta: {
          aliasName: 'brandmaterial',
          icon: 'icon-products',
          title: '素材管理',
          permissions: ['entity.brandmaterial']
        },
        children: [
          {
            path: 'editor/:id?',
            component: () => import('@/view/brand/wechat/artical/new_artical')
          }
        ]
      }
    ]
  }
]

export default routes
