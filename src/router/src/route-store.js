/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = 'ae421b4f.295713'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/store',
  component: Layout,
  children: [
    {
      path: 'shop/Shopwxshop',
      name: 'ae421b4f.f82d86',
      component: () => import('@/view/base/shop/wxshop'),
      children: [
        {
          path: 'editor/:wxShopId?',
          component: () => import('@/view/base/shop/editshop')
        }
      ]
    },
    {
      path: 'storemanager/marketingdistributor',
      name: 'ae421b4f.a4d703',
      component: () => import('@/view/mall/marketing/distributor'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/merchant/store')
        },
        {
          path: 'template',
          component: () => import('@/view/mall/marketing/distributor_template')
          // component: () => import('@/view/wxapp/home')
        },
        {
          path: 'details/:id?',
          component: () => import('@/view/mall/marketing/distributor_details')
        },
        {
          path: 'wxpaysetting',
          component: () => import('@/view/mall/marketing/distributor_wxpaysetting')
        },
        {
          path: 'alipaysetting',
          component: () => import('@/view/mall/marketing/distributor_alipaysetting')
        },
        {
          path: 'storeupload',
          component: () => import('@/view/mall/marketing/shopUpload')
        }
      ]
    },
    {
      path: 'storemanager/distributoraftersalesaddress',
      name: 'ae421b4f.c096c4',
      component: () => import('@/view/mall/marketing/distributorAftersalesAddress')
    },
    {
      path: 'storemanager/exportstoreitems',
      name: 'ae421b4f.068bb6',
      component: () => import('@/view/mall/marketing/productUpdate')
    },
    {
      path: 'storemanager/marketinglog',
      name: 'ae421b4f.fe37d0',
      component: () => import('@/view/mall/marketing/distributionLog')
    },
    {
      path: 'storemanager/storewhitelist',
      name: 'ae421b4f.899e90',
      component: () => import('@/view/mall/marketing/storewhitelist'),
      children: [
        {
          path: 'storewhitelistUpload',
          component: () => import('@/view/mall/marketing/storewhitelistUpload')
        }
      ]
    }
  ]
}
