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
      title: '2c432cc1.9897d8'
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
          title: '2c432cc1.81a684',
          permissions: ['entity.goods.goodsphysical']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/goods/index'),
            meta: {
              title: '2c432cc1.27fabd',
              hidden: true
            }
          },
          {
            path: 'physicalupload/:itemId?',
            component: () => import('@/view/mall/goods/physical/normalGoodsUpload.vue'),
            meta: {
              title: '2c432cc1.a4c910',
              hidden: true
            }
          },
          {
            path: 'stock-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload'),
            meta: {
              title: '2c432cc1.ac5320',
              hidden: true
            }
          },
          {
            path: 'profit-sharing-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsProfitUpload'),
            meta: {
              title: '2c432cc1.022564',
              hidden: true
            }
          },
          {
            path: 'product-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsUpload'),
            meta: {
              title: '2c432cc1.9745ac',
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
          title: '2c432cc1.8065fb',
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
          title: '2c432cc1.b1c9d7',
          permissions: ['entity.goods.goodsaudit']
        },
        children: [
          {
            path: 'editor/:itemId?',
            // component: () => import('@/view/mall/goods/audit/add'),
            component: () => import('@/view/goods/index'),
            meta: {
              icon: 'icon-products',
              title: '2c432cc1.241aca',
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
          title: '2c432cc1.b3ed9f',
          permissions: ['entity.goodsgroup.goodsmaincategory']
        }
      },
      {
        name: 'saleCategory',
        path: 'product-category/sale-category',
        component: () => import('@/view/goods/saleCategory'),
        meta: {
          title: '2c432cc1.392d49',
          permissions: ['entity.goodsgroup.goodscategory']
        }
      },
      {
        name: 'productTag',
        path: 'product-category/product-tag',
        component: () => import('@/view/mall/goods/tags'),
        meta: {
          title: '2c432cc1.0f394b',
          permissions: ['entity.goodsgroup.itemtags']
        }
      },
      {
        name: 'productSku',
        path: 'base-config/product-sku',
        component: () => import('@/view/mall/goods/attributes/attributes'),
        meta: {
          title: '2c432cc1.5fceb3',
          permissions: ['entity.goodsbase.goodsattributes']
        }
      },
      {
        name: 'minimumOrderQuantity',
        path: 'base-config/minimum-order-quantity',
        component: () => import('@/view/mall/goods/attributes/goodsattributes'),
        meta: {
          title: '2c432cc1.ed52fd',
          permissions: ['entity.goodsbase.goodsstartnum']
        }
      },
      {
        name: 'productBrand',
        path: 'base-config/product-brand',
        component: () => import('@/view/mall/goods/attributes/brand'),
        meta: {
          title: '2c432cc1.ef6fc3',
          permissions: ['entity.goodsbase.goodsbrand']
        }
      },
      {
        name: 'productParams',
        path: 'base-config/product-params',
        component: () => import('@/view/mall/goods/attributes/params'),
        meta: {
          title: '2c432cc1.8686bb',
          permissions: ['entity.goodsbase.goodsparams']
        }
      },
      {
        name: 'rankingList',
        path: 'base-config/ranking-list',
        component: () => import('@/view/mall/goods/ranking/index'),
        meta: {
          title: '2c432cc1.1db489',
          permissions: ['entity.goodsbase.rankingList']
        }
      },
      {
        name: 'exportstoreitems',
        path: 'product-manage/exportstoreitems',
        component: () => import('@/view/mall/marketing/productUpdate'),
        meta: {
          title: '2c432cc1.068bb6',
          permissions: ['entity.goods.exportstoreitems']
        }
      }
    ]
  }
]

export default routes
