/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'sellers',
      icon: 'shop',
      keepAlive: true,
      title: '088817ee.0f09a8'
    },
    name: 'merchantSellers',
    path: '/merchant/sellers',
    children: [
      {
        name: 'merchantInfo',
        path: 'merchant-info',
        component: () => import('@/view/mall/marketing/merchantList/editor.vue'),
        meta: {
          aliasName: 'merchantinfo',
          icon: 'icon-merchant',
          title: '088817ee.82e4c8',
          permissions: ['sellers.merchantinfo']
        }
      },
      {
        name: 'storeList',
        path: 'store-list',
        component: () => import('@/view/mall/marketing/distributor'),
        meta: {
          aliasName: 'marketingdistributor',
          icon: 'icon-shop',
          title: '088817ee.a4d703',
          permissions: ['sellers.marketingdistributor']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/merchant/store'),
            meta: {
              title: '088817ee.922ec0',
              hidden: true
            }
          },
          {
            path: 'template/:distributor_id?',
            component: () => import('@/view/mall/marketing/distributor_template'),
            meta: {
              title: '088817ee.5da484',
              hidden: true
            }
          },
          {
            path: 'details/:id?',
            component: () => import('@/view/mall/marketing/distributor_details'),
            meta: {
              title: '088817ee.9d54ec',
              hidden: true
            }
          },
          {
            path: 'wxpaysetting',
            component: () => import('@/view/mall/marketing/distributor_wxpaysetting'),
            meta: {
              title: '088817ee.bd5e8a',
              hidden: true
            }
          },
          {
            path: 'alipaysetting',
            component: () => import('@/view/mall/marketing/distributor_alipaysetting'),
            meta: {
              title: '088817ee.135e7b',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'afterSalesAddress',
        path: 'aftersales-address',
        component: () => import('@/view/mall/marketing/distributorAftersalesAddress'),
        meta: {
          aliasName: 'distributoraftersalesaddress',
          icon: 'icon-address',
          title: '088817ee.c096c4',
          permissions: ['sellers.distributoraftersalesaddress']
        }
      },
      {
        name: 'popularizeGoods',
        path: 'popularize-goods',
        component: () => import('@/view/popularize/goodsStore'),
        meta: {
          aliasName: 'popularizegoods',
          icon: 'icon-goods',
          title: '088817ee.ad8ef8',
          permissions: ['sellers.popularizegoods']
        }
      },
      {
        name: 'marketingSalesman',
        path: 'marketing-salesman',
        component: () => import('@/view/guide/salesman'),
        meta: {
          aliasName: 'marketingsalesman',
          icon: 'icon-salesman',
          title: '088817ee.808d6c',
          permissions: ['sellers.marketingsalesman']
        },
        children: [
          {
            path: 'children',
            component: () => import('@/view/guide/children'),
            meta: {
              title: '088817ee.a6ebab',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'popularizeData',
        path: 'popularize-data',
        component: () => import('@/view/popularize/data'),
        meta: {
          aliasName: 'popularizedata',
          icon: 'icon-data',
          title: '088817ee.b0bf8e',
          permissions: ['sellers.popularizedata']
        },
        children: [
          {
            path: 'detail',
            component: () => import('@/view/popularize/brokerageLog'),
            meta: {
              title: '088817ee.20cd45',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'popularizeWithdraw',
        path: 'popularize-withdraw',
        component: () => import('@/view/mall/marketing/salesmanwithdraw'),
        meta: {
          aliasName: 'popularizewithdraw',
          icon: 'icon-withdraw',
          title: '088817ee.f8e42e',
          permissions: ['sellers.popularizewithdraw']
        }
      }
    ]
  }
]

export default routes
