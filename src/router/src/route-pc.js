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
const name = 'pc装修'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/pc',
  component: Layout,
  children: [
    {
      path: 'templatelist',
      name: `模版列表`,
      component: () => import('@/view/pc/pctemplate')
    },
    {
      path: 'Pctemplate',
      name: `模版编辑`,
      component: () => import('@/view/pc/homePage/default')
    },
    {
      path: 'design',
      name: `模版编辑`,
      meta: {
        hidemenu: true
      }
    },
    {
      path: 'tdkglobalset',
      name: `全局TDK配置`,
      component: () => import('@/view/pc/tdk/globalset')
    },
    {
      path: 'tdkgivenset',
      name: `指定页面TDK配置`,
      component: () => import('@/view/pc/tdk/givenset')
    }
  ]
}
