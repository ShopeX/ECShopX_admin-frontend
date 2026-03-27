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
      title: 'e8b0aec3.9897d8'
    },
    name: 'supplierEntitygoods',
    path: '/supplier/entity',
    children: [
      {
        name: 'productManageSelfProducts',
        path: 'product-manage/self-products',
        component: () => import('@/view/mall/goods/physical/list'),
        meta: {
          aliasName: 'goodsphysical',
          icon: 'icon-products',
          title: 'e8b0aec3.5782b6',
          permissions: ['entity.goodsphysical']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/goods/index'),
            meta: {
              title: 'e8b0aec3.7d3792',
              hidden: true,
              footerFixed: true
            }
          },
          {
            path: 'physicalupload/:itemId?',
            component: () => import('@/view/mall/goods/physical/normalGoodsUpload.vue'),
            meta: {
              title: 'e8b0aec3.a4c910',
              hidden: true
            }
          },
          {
            path: 'stock-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload'),
            meta: {
              title: 'e8b0aec3.ac5320',
              hidden: true
            }
          },
          {
            path: 'profit-sharing-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsProfitUpload'),
            meta: {
              title: 'e8b0aec3.022564',
              hidden: true
            }
          },
          {
            path: 'product-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsUpload'),
            meta: {
              title: 'e8b0aec3.9745ac',
              hidden: true
            }
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
          title: 'e8b0aec3.9745ac',
          permissions: ['entity.physicalupload']
        }
      },
      {
        name: `materialManagement`,
        path: 'material-management',
        component: () => import('@/views/content/aterialmanagement'),
        meta: {
          aliasName: 'brandmaterial',
          icon: 'icon-products',
          title: 'e8b0aec3.b49e2f',
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
