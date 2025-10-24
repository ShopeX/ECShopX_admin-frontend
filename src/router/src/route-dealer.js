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

// 商品路由
const name = '经销商'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shop_dealer',
  component: Layout,
  children: [
    {
      path: 'dealer_list',
      name: `经销商管理`,
      component: () => import('@/view/mall/marketing/dealer'),
      children: [
        {
          path: 'detail/:id?',
          component: () => import('@/view/mall/marketing/dealer/detail'),
          children: [
            {
              path: 'storelist/:id?',
              component: () => import('@/view/mall/marketing/dealer/storelist'),
              children: [
                {
                  path: 'relation/:id?',
                  component: () => import('@/view/mall/marketing/dealer/relationstorelist')
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
