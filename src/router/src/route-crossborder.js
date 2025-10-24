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

// 跨境
const name = '跨境'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/crossborder',
  component: Layout,
  children: [
    {
      path: 'origincountry',
      name: `产地国`,
      component: () => import('@/view/crossborder/origincountry/list')
    },
    {
      path: 'crossbordersetinfo',
      name: `跨境设置`,
      component: () => import('@/view/crossborder/crossborderset/info')
    },
    {
      path: 'godsphysicalkj',
      name: `商品管理`,
      component: () => import('@/view/mall/goods/physical/list'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/goods/physical/add')
        }
      ]
    },
    {
      path: 'taxstrategy',
      name: `税费策略`,
      component: () => import('@/view/crossborder/taxstrategy/list'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/view/crossborder/taxstrategy/edit')
        }
      ]
    }
  ]
}
