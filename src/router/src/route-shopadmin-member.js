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
const name = '会员'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin/member',
  component: Layout,
  children: [
    {
      path: 'member',
      name: `会员列表`,
      component: () => import('@/view/member/members/list'),
      children: [
        {
          path: 'detail/:user_id?',
          component: () => import('@/view/member/members/detail')
        },
        {
          path: 'chiefupload',
          component: () => import('@/view/member/members/upload_chief')
        }
      ]
    },
    {
      path: 'Managetag',
      name: `会员标签`,
      component: () => import('@/view/member/members/tags')
    },
    {
      path: 'purchase/employee',
      name: '员工管理',
      component: () => import('@/view/member/purchase/employee'),
      children: [
        {
          path: 'import',
          name: `白名单导入`,
          component: () => import('@/view/member/purchase/employeeImport')
        }
      ]
    },

    {
      path: 'purchase/company',
      name: '企业管理',
      component: () => import('@/view/member/purchase/company')
    }
  ]
}
