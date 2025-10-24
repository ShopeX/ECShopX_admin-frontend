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
const name = '设置'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin/shopsetting',
  component: Layout,
  children: [
    {
      path: 'staff/Merchantstaff',
      name: `账号管理-店铺管理员`,
      component: () => import('@/view/base/account/storestaff')
    },
    {
      path: 'staff/Merchantstaffroles',
      name: `账号管理-店铺员工角色`,
      component: () => import('@/view/base/account/storeroles')
    },
    {
      path: 'staff/selfdeliverystaff',
      name: `账号管理-店铺配送员`,
      component: () => import('@/view/base/account/delivery')
    },
    {
      path: 'baseexport',
      name: `导出列表`,
      component: () => import('@/view/base/exportlog/index')
    },
    {
      path: 'adapay_member',
      name: `开户管理`,
      component: () => import('@/view/dealer/create_account.vue')
    },
    {
      path: 'adapay_cash_set',
      name: '提现设置',
      component: () => import('@/view/mall/withdraw/withdraw_setting.vue')
    },
    {
      path: 'datapass/apply',
      name: '权限申请',
      component: () => import('@/view/base/encrypt/authAdmin.vue')
    }
  ]
}
