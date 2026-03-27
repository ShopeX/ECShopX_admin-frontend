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
      title: '5051a3c8.9897d8'
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
          title: '5051a3c8.81a684',
          permissions: ['entity.goodsphysical']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/goods/index'),
            meta: {
              title: '5051a3c8.27fabd',
              hidden: true
            }
          },
          {
            path: 'stock-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload'),
            meta: {
              title: '5051a3c8.ac5320',
              hidden: true
            }
          },
          {
            path: 'product-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsUpload'),
            meta: {
              title: '5051a3c8.9745ac',
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
          title: '5051a3c8.54d6cd',
          permissions: ['entity.storeshopproductanagement']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/goods/index')
          },
          {
            path: 'physicalupload',
            name: '5051a3c8.9745ac',
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
          title: '5051a3c8.9745ac',
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
          title: '5051a3c8.ef6fc3',
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
          title: '5051a3c8.0f5629',
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
          title: '5051a3c8.0f394b',
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
          title: '5051a3c8.d58254',
          permissions: ['entity.rate']
        }
      },
      {
        name: `materialManagement`,
        path: 'material-management',
        component: () => import('@/views/content/aterialmanagement'),
        meta: {
          aliasName: 'brandmaterial',
          icon: 'icon-products',
          title: '5051a3c8.b49e2f',
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
