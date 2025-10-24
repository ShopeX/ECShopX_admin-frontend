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
const name = '商家'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/sellers',
  component: Layout,
  children: [
    {
      path: 'storemanager/marketingdistributor',
      name: `店铺列表`,
      component: () => import('@/view/mall/marketing/distributor'),
      children: [
        {
          path: 'editor/:itemId?',
          // component: () => import('@/view/mall/marketing/distributor_editor')
          component: () => import('@/view/merchant/store')
        },
        {
          path: 'template/:distributor_id?',
          component: () => import('@/view/mall/marketing/distributor_template')
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
        }
      ]
    },
    {
      path: 'salesorganization/list',
      name: `商家列表`,
      component: () => import('@/view/mall/marketing/merchantList/index'),
      children: [
        {
          path: 'editor',
          component: () => import('@/view/mall/marketing/merchantList/editor')
        }
      ]
    },
    {
      path: 'marketingsalesman',
      name: `业务员`,
      component: () => import('@/view/guide/salesman'),
      children: [
        {
          path: 'children',
          component: () => import('@/view/guide/children')
        }
      ]
    },
    {
      path: 'marketing/popularize/popularizedata',
      name: `业务员业绩`,
      component: () => import('@/view/popularize/data'),
      children: [
        {
          path: 'detail',
          component: () => import('@/view/popularize/brokerageLog')
        }
      ]
    },
    {
      path: 'marketing/popularize/salesman/withdraw',
      name: `业务员提现`,
      component: () => import('@/view/mall/marketing/salesmanwithdraw')
    },

    {
      path: 'popularize/popularizegoods',
      name: `业务员商品`,
      component: () => import('@/view/popularize/goodsStore')
    },

    {
      path: 'storemanager/distributortags',
      name: `商家标签`,
      component: () => import('@/view/mall/marketing/distributortags')
    },
    {
      path: 'storemanager/distributoraftersalesaddress',
      name: `售后地址`,
      component: () => import('@/view/mall/marketing/distributorAftersalesAddress')
    },
    {
      path: 'storemanager/application',
      name: `入驻审核`,
      component: () => import('@/view/mall/marketing/merchantVerify'),
      children: [
        {
          path: 'verify',
          component: () => import('@/view/mall/marketing/merchantVerify/verify')
        }
      ]
    },
    {
      path: 'salesetting/setting',
      name: '商户设置',
      component: () => import('@/view/mall/marketing/setting')
    }
  ]
}
