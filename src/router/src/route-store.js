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

// 会员路由
const name = '店铺'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/store',
  component: Layout,
  children: [
    {
      path: 'shop/Shopwxshop',
      name: `服务网店`,
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
      name: `店铺列表`,
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
      name: `售后地址`,
      component: () => import('@/view/mall/marketing/distributorAftersalesAddress')
    },
    {
      path: 'storemanager/exportstoreitems',
      name: `店铺商品更新`,
      component: () => import('@/view/mall/marketing/productUpdate')
    },
    {
      path: 'storemanager/marketinglog',
      name: `店铺记录`,
      component: () => import('@/view/mall/marketing/distributionLog')
    },
    {
      path: 'storemanager/storewhitelist',
      name: `店铺白名单`,
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
