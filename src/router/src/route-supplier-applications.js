/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '9bedcee8.5b0520'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/applications',
  component: Layout,
  children: [
    {
      path: 'adapay/adapay_trades',
      name: '9bedcee8.85b2f8',
      component: () => import('@/view/mall/sub_account/sub_account'),
      children: [
        {
          path: 'detail/:order_id',
          component: () => import('@/view/mall/sub_account/detail')
        }
      ]
    },
    {
      path: 'adapay/adapay_cash',
      name: '9bedcee8.db7971',
      component: () => import('@/view/mall/withdraw/withdraw')
    },
    {
      path: 'adapay/adapay_cash_setting',
      name: '9bedcee8.b33aa1',
      component: () => import('@/view/mall/withdraw/withdraw_setting.vue')
    },
    {
      path: 'adapay/adapay_merchant_info',
      name: '9bedcee8.ac7b4c',
      component: () => import('@/view/mall/accountopeninfo')
    },
    {
      path: 'adapay/adapay_member_audit',
      name: '9bedcee8.5bf3b3',
      component: () => import('@/view/mall/marketing/openingapproval'),
      children: [
        {
          path: 'approve/:id?',
          component: () => import('@/view/mall/marketing/openingapproval/approve')
        }
      ]
    },
    {
      path: 'adapay/adapay_merchant',
      name: '9bedcee8.eee869',
      component: () => import('@/view/base/setting/dealer'),
      children: [
        {
          path: '/',
          component: () => import('@/view/base/setting/dealer/account_info')
        },
        {
          path: 'picture',
          component: () => import('@/view/base/setting/dealer/upload_picture')
        },
        {
          path: 'pay_setting',
          component: () => import('@/view/base/setting/dealer/pay_setting')
        },
        {
          path: 'netin',
          component: () => import('@/view/base/setting/dealer/netin')
        }
      ]
    },
    {
      path: 'jfmall/jfgoods',
      name: '9bedcee8.5782b6',
      component: () => import('@/view/applications/pointmall/list'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/applications/pointmall/add')
        },
        {
          path: 'physicalupload',
          name: '9bedcee8.0d9697',
          component: () => import('@/view/applications/pointmall/goodsImport')
        },
        {
          path: 'physicalstoreupload',
          name: '9bedcee8.e9f31e',
          component: () => import('@/view/applications/pointmall/storeImport')
        }
      ]
    },
    {
      path: 'jfmall/jforders',
      name: '9bedcee8.72ab0d',
      component: () => import('@/view/applications/pointmall/orderList'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/applications/pointmall/orderDetail')
        }
      ]
    },
    {
      path: 'jfmall/jfsetting',
      name: '9bedcee8.0aeca0',
      component: () => import('@/view/applications/pointmall/setting')
    },
    {
      path: 'appsgroup/extapp',
      name: '9bedcee8.e7a708',
      component: () => import('@/view/applications/plugin'),
      children: [
        {
          path: 'detail/:id?',
          component: () => import('@/view/applications/plugin/appDetail.vue')
        }
      ]
    }
  ]
}
