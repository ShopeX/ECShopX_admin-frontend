/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'store',
      icon: 'application',
      keepAlive: true,
      title: '6478e260.295713'
    },
    name: 'store',
    path: '/store',
    children: [
      {
        name: 'storeManageSelfStore',
        path: 'store-manage/self-store',
        component: () => import('@/view/mall/marketing/distributor'),
        meta: {
          aliasName: 'marketingdistributor',
          icon: 'icon-shop',
          title: '6478e260.1b1b01',
          permissions: ['store.storemanager.marketingdistributor']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/merchant/store'),
            meta: {
              title: '6478e260.922ec0',
              hidden: true
            }
          },
          {
            path: 'template',
            component: () => import('@/view/mall/marketing/distributor_template'),
            meta: {
              title: '6478e260.5da484',
              hidden: true
            }
          },
          {
            path: 'details/:id?',
            component: () => import('@/view/mall/marketing/distributor_details'),
            meta: {
              title: '6478e260.9d54ec',
              hidden: true
            }
          },
          {
            path: 'wxpaysetting',
            component: () => import('@/view/mall/marketing/distributor_wxpaysetting'),
            meta: {
              title: '6478e260.bd5e8a',
              hidden: true
            }
          },
          {
            path: 'alipaysetting',
            component: () => import('@/view/mall/marketing/distributor_alipaysetting'),
            meta: {
              title: '6478e260.135e7b',
              hidden: true
            }
          },
          {
            path: 'storeupload',
            component: () => import('@/view/mall/marketing/shopUpload'),
            meta: {
              title: '6478e260.081090',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'storeManageStoreWhitelist',
        path: 'store-manage/store-whitelist',
        component: () => import('@/view/mall/marketing/storewhitelist'),
        meta: {
          aliasName: 'storewhitelist',
          icon: 'icon-whitelist',
          title: '6478e260.899e90',
          permissions: ['store.storemanager.storewhitelist']
        },
        children: [
          {
            path: 'storewhitelistUpload',
            component: () => import('@/view/mall/marketing/storewhitelistUpload'),
            meta: {
              title: '6478e260.ba584c',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'storeManageStoreRules',
        path: 'store-manage/store-rules',
        meta: {
          aliasName: 'storerules',
          icon: 'icon-address',
          title: '6478e260.08894b',
          permissions: ['store.storemanager.storerules']
        },
        component: () => import('@/views/store/storeRules/store-rules')
      },
      {
        name: 'storeManageStoreCategory',
        path: 'store-manage/store-category',
        meta: {
          aliasName: 'storecategory',
          icon: 'icon-address',
          title: '6478e260.2419d0',
          permissions: ['store.storemanager.storecategory']
        },
        component: () => import('@/views/store/store-category')
      },
      {
        name: 'storeManageNearbyStoreInfo',
        path: 'store-manage/nearby-store-info',
        meta: {
          aliasName: 'nearbystoreinfo',
          icon: 'icon-address',
          title: '6478e260.84b1aa',
          permissions: ['store.storemanager.nearbystoreinfo']
        },
        component: () => import('@/views/store/nearby-store-info')
      },
      {
        name: 'storeManageRefundAddress',
        path: 'store-manage/refund-address',
        meta: {
          aliasName: 'distributoraftersalesaddress',
          icon: 'icon-address',
          title: '6478e260.6356a8',
          permissions: ['store.storemanager.distributoraftersalesaddress']
        },
        component: () => import('@/view/mall/marketing/distributorAftersalesAddress')
      }
    ]
  }
]

export default routes
