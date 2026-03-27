/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'supply',
      icon: 'ad-product',
      // icon: 'application',
      keepAlive: true,
      title: '55038796.104fec'
    },
    name: 'supply',
    path: '/supply',
    children: [
      {
        name: 'productList',
        path: 'product-manage/product-list',
        meta: {
          aliasName: 'supplier_goods_list',
          icon: 'pay-circle',
          title: '55038796.5782b6',
          permissions: ['supply.supplygoods.supplier_goods_list']
        },
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
            name: `55038796.ac5320`,
            component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload')
          },
          {
            path: 'physicalprofitupload',
            name: `55038796.022564`,
            component: () => import('@/view/mall/goods/physical/normalGoodsProfitUpload')
          },
          {
            path: 'physicalupload',
            name: `55038796.9745ac`,
            component: () => import('@/view/mall/goods/physical/normalGoodsUpload')
          }
        ]
      },
      {
        name: 'productReview',
        path: 'product-manage/product-review',
        meta: {
          aliasName: 'goods_suppliergoods',
          icon: 'pay-circle',
          title: '55038796.a453a5',
          permissions: ['supply.supplygoods.goods_suppliergoods']
        },
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
        name: 'supplierList',
        path: 'supplier-manage/supplier-list',
        meta: {
          aliasName: 'supplier_list',
          icon: 'pay-circle',
          title: '55038796.1e4a8e',
          permissions: ['supply.supplymanage.supplier_list']
        },
        component: () => import('@/view/mall/supplier/supplier_list')
      },
      {
        name: 'supplierAccount',
        path: 'supplier-manage/supplier-account',
        meta: {
          aliasName: 'supplier',
          icon: 'pay-circle',
          title: '55038796.55c7cb',
          permissions: ['supply.supplymanage.supplier']
        },
        component: () => import('@/view/base/account/suppliers')
      }
    ]
  }
]

export default routes
