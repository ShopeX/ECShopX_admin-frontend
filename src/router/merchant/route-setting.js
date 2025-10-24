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
const name = '设置'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/merchant/setting',
  component: Layout,
  children: [
    {
      path: 'Merchantstaff',
      name: `账号管理-店铺管理员`,
      component: () => import('@/view/base/account/storestaff')
      // component: () => import('@/view/base/exportlog/index')
    },
    {
      path: 'account',
      name: `账号管理-商户账号管理`,
      component: () => import('@/view/mall/marketing/merchantAccount')
    },
    {
      path: 'staff/selfdeliverystaff',
      name: `账号管理-商户配送员`,
      component: () => import('@/view/base/account/delivery')
    },
    {
      path: 'baseexport',
      name: `导出列表`,
      component: () => import('@/view/base/exportlog/index')
    },

    {
      path: 'operatorlogs',
      name: `操作日志`,
      component: () => import('@/view/base/setting/companys/logs')
    },

    {
      path: 'datapassapprove',
      name: '权限申请',
      component: () => import('@/view/base/encrypt/authAdmin.vue')
    },
    {
      path: 'datapassapply',
      name: `权限审批`,
      component: () => import('@/view/base/setting/authorityapproval'),
      children: [
        {
          path: 'approve/:id?',
          component: () => import('@/view/base/setting/authorityapproval/approve')
        }
      ]
    }
  ]
}
