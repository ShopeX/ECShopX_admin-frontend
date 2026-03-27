/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = 'fd8ae37a.104fec'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/supply',
  component: Layout,
  children: [
    {
      path: 'supplymanage/supplier_list',
      name: 'fd8ae37a.c791ee',
      component: () => import('@/view/mall/supplier/supplier_list')
    },
    // 供应商商品列表
    {
      path: 'supplygoods/supplier_goods_list',
      name: 'fd8ae37a.b82a7b',
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
          name: 'fd8ae37a.ac5320',
          component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload')
        },
        {
          path: 'physicalprofitupload',
          name: 'fd8ae37a.022564',
          component: () => import('@/view/mall/goods/physical/normalGoodsProfitUpload')
        },
        {
          path: 'physicalupload',
          name: 'fd8ae37a.9745ac',
          component: () => import('@/view/mall/goods/physical/normalGoodsUpload')
        }
      ]
    },
    // 供应商商品审核
    {
      path: 'supplygoods/suppliergoods',
      name: 'fd8ae37a.f59744',
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
      path: 'supplymanage/supplier',
      name: 'fd8ae37a.923f0f',
      component: () => import('@/view/base/account/suppliers')
    }
  ]
}
