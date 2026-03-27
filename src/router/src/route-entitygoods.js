/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '848f4323.9897d8'
import Layout from '@/view/layout' // 主框架
import SubLayout from '@/view/sublayout' // 主框架

export default {
  path: '/entity',
  component: Layout,
  children: [
    // 自营商品
    {
      path: 'goods/goodsphysical',
      name: '848f4323.5782b6',
      component: () => import('@/view/mall/goods/physical/list'),
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
          name: '848f4323.ac5320',
          component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload')
        },
        {
          path: 'physicalprofitupload',
          name: '848f4323.022564',
          component: () => import('@/view/mall/goods/physical/normalGoodsProfitUpload')
        },
        {
          path: 'physicalupload',
          name: '848f4323.9745ac',
          component: () => import('@/view/mall/goods/physical/normalGoodsUpload')
        }
      ]
    },
    {
      path: 'goods/storeshopitemanagement',
      name: '848f4323.54d6cd',
      // component: () => import('@/view/mall/storeshop/itemlist')
      component: () => import('@/view/mall/storeshop/store-shop.standard')
    },
    {
      path: 'goods/goodsaudit',
      name: '848f4323.eab74c',
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
    // 商品分类
    {
      path: 'goodsgroup/goodscategory',
      name: '848f4323.392d49',
      // component: () => import('@/view/mall/goods/category')
      component: () => import('@/view/goods/saleCategory')
    },
    {
      path: 'goodsgroup/goodsmaincategory',
      name: '848f4323.b3ed9f',
      // component: () => import('@/view/mall/goods/maincategory')
      component: () => import('@/view/goods/mainCategory')
    },
    {
      path: 'goodsgroup/itemtags',
      name: '848f4323.0f394b',
      component: () => import('@/view/mall/goods/tags')
    },
    // 基础设置
    {
      path: 'goodsbase/goodsattributes',
      name: '848f4323.5fceb3',
      component: () => import('@/view/mall/goods/attributes/attributes')
    },
    {
      path: 'goodsbase/goodsstartnum',
      name: '848f4323.ed52fd',
      component: () => import('@/view/mall/goods/attributes/goodsattributes')
    },
    {
      path: 'goodsbase/goodsbrand',
      name: '848f4323.ef6fc3',
      component: () => import('@/view/mall/goods/attributes/brand')
    },
    {
      path: 'goodsbase/goodsparams',
      name: '848f4323.8686bb',
      component: () => import('@/view/mall/goods/attributes/params')
    },
    {
      path: 'goods/itemstagupload',
      name: '848f4323.4f1e39',
      component: () => import('@/view/mall/goods/physical/normalGoodsTagUpload')
    },
    {
      path: 'goods/physicalupload',
      name: '848f4323.0d9697',
      component: () => import('@/view/mall/goods/physical/normalGoodsUpload')
    },

    {
      path: 'service_goods/servicegoods',
      name: '848f4323.5782b6',
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
