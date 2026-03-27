/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic'
import SubLayout from '@/view/sublayout'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'sellers',
      icon: 'branch-one',
      keepAlive: true,
      title: 'fb06c42c.9f1ea3'
    },
    name: 'sellers',
    path: '/sellers',
    children: [
      {
        name: 'merchant',
        path: 'merchant',
        meta: {
          aliasName: 'storemanager',
          icon: 'pay-circle',
          title: 'fb06c42c.9f1ea3',
          permissions: ['sellers.salesorganization.storemanager']
        },
        component: () => import('@/view/mall/marketing/merchantList/index'),
        children: [
          {
            path: 'editor',
            component: () => import('@/view/mall/marketing/merchantList/editor')
          }
        ]
      },
      {
        name: 'store',
        path: 'join/store',
        meta: {
          aliasName: 'marketingsellers',
          icon: 'pay-circle',
          title: 'fb06c42c.654af8',
          permissions: ['sellers.sellersmanager.marketingsellers']
        },
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
          },
          {
            path: 'storeupload',
            component: () => import('@/view/mall/marketing/shopUpload')
          }
        ]
      },
      {
        name: 'review',
        path: 'entry/review',
        meta: {
          aliasName: 'storemanager_application',
          icon: 'pay-circle',
          title: 'fb06c42c.20d385',
          permissions: ['sellers.sellersmanager.storemanager_application']
        },
        component: () => import('@/view/mall/marketing/merchantVerify'),
        children: [
          {
            path: 'verify',
            component: () => import('@/view/mall/marketing/merchantVerify/verify')
          }
        ]
      },
      {
        name: 'address',
        path: 'return/address',
        meta: {
          aliasName: 'distributoraftersalesaddress1',
          icon: 'pay-circle',
          title: 'fb06c42c.6356a8',
          permissions: ['sellers.sellersmanager.distributoraftersalesaddress1']
        },
        component: () => import('@/view/mall/marketing/distributorAftersalesAddress')
      },
      {
        name: 'label',
        path: 'store/label',
        meta: {
          aliasName: 'Sellerstags',
          icon: 'pay-circle',
          title: 'fb06c42c.e86c4b',
          permissions: ['sellers.sellersmanager.Sellerstags']
        },
        component: () => import('@/view/mall/marketing/distributortags')
      },
      {
        name: 'category',
        path: 'merchant/category',
        meta: {
          aliasName: 'storemanager_setting',
          icon: 'pay-circle',
          title: 'fb06c42c.b2662c',
          permissions: ['sellers.salesetting.storemanager_setting']
        },
        component: () => import('@/view/mall/marketing/setting')
      }
    ]
  }
]

export default routes
