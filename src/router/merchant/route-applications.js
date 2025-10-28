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
const name = '应用'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/merchant/applications',
  component: Layout,
  children: [
    {
      path: 'bspay/user',
      name: '进件管理',
      component: () => import('@/view/dealer/bspay_create_user')
    },
    {
      path: 'bspay/trades',
      name: '分账明细',
      component: () => import('@/view/mall/bspay_sub_account/sub_account'),
      children: [
        {
          path: 'detail/:order_id',
          component: () => import('@/view/mall/bspay_sub_account/detail')
        }
      ]
    }
  ]
}
