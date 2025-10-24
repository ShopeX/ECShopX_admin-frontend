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

import { BasicLayout } from '@/layout/basic'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'supply',
      icon: 'ad-product',
      // icon: 'application',
      keepAlive: true,
      title: '供应'
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
          title: '商品管理',
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
        name: 'productReview',
        path: 'product-manage/product-review',
        meta: {
          aliasName: 'goods_suppliergoods',
          icon: 'pay-circle',
          title: '商品审核',
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
          title: '供应商列表',
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
          title: '供应商账号',
          permissions: ['supply.supplymanage.supplier']
        },
        component: () => import('@/view/base/account/suppliers')
      }
    ]
  }
]

export default routes
