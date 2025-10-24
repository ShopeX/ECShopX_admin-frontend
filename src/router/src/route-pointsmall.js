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
const name = '积分商城'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/pointsmall',
  component: Layout,
  children: [
    {
      path: 'pointsmallgoods/pointsmallmaincategory',
      name: `商品管理分类`,
      component: () => import('@/view/mall/pointsmallgoods/maincategory')
    },
    {
      path: 'pointsmallgoods/pointsmallcategory',
      name: `商品分类`,
      component: () => import('@/view/mall/pointsmallgoods/category')
    },
    {
      path: 'pointsmallgoods/pointsmallattributes',
      name: `商品规格`,
      component: () => import('@/view/mall/pointsmallgoods/attributes/attributes')
    },
    {
      path: 'pointsmallgoods/pointsmallparams',
      name: `商品参数`,
      component: () => import('@/view/mall/pointsmallgoods/attributes/params')
    },
    {
      path: 'pointsmallgoods/pointsmallbrand',
      name: `商品品牌`,
      component: () => import('@/view/mall/pointsmallgoods/attributes/brand')
    },
    {
      path: 'pointsmallgoods/pointsmallrate',
      name: `商品评价`,
      component: () => import('@/view/mall/pointsmalltrade/rate/list')
    },
    {
      path: 'setting/templatesetting',
      name: `模版设置`,
      component: () => import('@/view/mall/templatesetting')
    }
  ]
}
