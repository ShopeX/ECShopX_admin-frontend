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
      title: '766e6b00.295713'
    },
    name: 'shopadminStore',
    path: '/shopadmin/store',
    children: [
      {
        name: 'marketingDistributor',
        path: 'marketingdistributor',
        component: () => import('@/view/mall/marketing/distributor'),
        meta: {
          aliasName: 'marketingdistributor',
          icon: 'icon-shop',
          title: '766e6b00.e7e6e2',
          permissions: ['store.marketingdistributor']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/merchant/store'),
            meta: {
              title: '766e6b00.922ec0',
              hidden: true
            }
          },
          {
            path: 'template/:distributor_id?',
            component: () => import('@/view/mall/marketing/distributor_template'),
            meta: {
              title: '766e6b00.5da484',
              hidden: true
            }
          },
          {
            path: 'details/:id?',
            component: () => import('@/view/mall/marketing/distributor_details'),
            meta: {
              title: '766e6b00.9d54ec',
              hidden: true
            }
          },
          {
            path: 'wxpaysetting',
            component: () => import('@/view/mall/marketing/distributor_wxpaysetting'),
            meta: {
              title: '766e6b00.bd5e8a',
              hidden: true
            }
          },
          {
            path: 'alipaysetting',
            component: () => import('@/view/mall/marketing/distributor_alipaysetting'),
            meta: {
              title: '766e6b00.135e7b',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'storeWhitelist',
        path: 'store-whitelist',
        component: () => import('@/view/mall/marketing/storewhitelist'),
        meta: {
          aliasName: 'storewhitelist',
          icon: 'icon-whitelist',
          title: '766e6b00.899e90',
          permissions: ['store.storewhitelist']
        },
        children: [
          {
            path: 'storewhitelistUpload',
            component: () => import('@/view/mall/marketing/storewhitelistUpload'),
            meta: {
              title: '766e6b00.ba584c',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'distributorCode',
        path: 'distributorCode',
        component: () => import('@/view/mall/marketing/distributorCode'),
        meta: {
          aliasName: 'distributorCode',
          icon: 'icon-qrcode',
          title: '766e6b00.147bf3',
          permissions: ['store.distributorCode']
        }
      },
      {
        name: 'marketingSalesman',
        path: 'marketingsalesman',
        component: () => import('@/view/guide/salesman'),
        meta: {
          aliasName: 'marketingsalesman',
          icon: 'icon-salesman',
          title: '766e6b00.808d6c',
          permissions: ['shopadmin.store.marketingsalesman']
        },
        children: [
          {
            path: 'detail',
            component: () => import('@/view/popularize/brokerageLog'),
            meta: {
              title: '766e6b00.306c79',
              hidden: true
            }
          },
          {
            path: 'child',
            component: () => import('@/view/popularize/children'),
            meta: {
              title: '766e6b00.884bdf',
              hidden: true
            }
          },
          {
            path: 'children',
            component: () => import('@/view/guide/children'),
            meta: {
              title: '766e6b00.a6ebab',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'popularizeGoods',
        path: 'popularize/popularizegoods',
        component: () => import('@/view/popularize/goodsStore'),
        meta: {
          aliasName: 'popularizegoods',
          icon: 'icon-goods',
          title: '766e6b00.ad8d69',
          permissions: ['shopadmin.store.popularize.popularizegoods']
        }
      },
      {
        name: 'popularizeList',
        path: 'marketing/popularize/popularizelist',
        component: () => import('@/view/popularize/list'),
        meta: {
          aliasName: 'popularizelist',
          icon: 'icon-popularize',
          title: '766e6b00.f08fa2',
          permissions: ['shopadmin.store.marketing.popularize.popularizelist']
        },
        children: [
          {
            path: 'detail',
            component: () => import('@/view/popularize/brokerageLog'),
            meta: {
              title: '766e6b00.de1e62',
              hidden: true
            }
          },
          {
            path: 'child',
            component: () => import('@/view/popularize/children'),
            meta: {
              title: '766e6b00.3adfae',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'popularizeData',
        path: 'marketing/popularize/popularizedata',
        component: () => import('@/view/popularize/data'),
        meta: {
          aliasName: 'popularizedata',
          icon: 'icon-data',
          title: '766e6b00.b0bf8e',
          permissions: ['shopadmin.store.marketing.popularize.popularizedata']
        },
        children: [
          {
            path: 'detail',
            component: () => import('@/view/popularize/brokerageLog'),
            meta: {
              title: '766e6b00.20cd45',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'popularizeWithdraw',
        path: 'popularizewithdraw',
        component: () => import('@/view/mall/marketing/salesmanwithdraw'),
        meta: {
          aliasName: 'popularizewithdraw',
          icon: 'icon-withdraw',
          title: '766e6b00.f8e42e',
          permissions: ['shopadmin.store.popularizewithdraw']
        }
      },
      {
        name: 'shopDecoration',
        path: 'tmpl/shopDecoration',
        component: () => import('@/view/mall/marketing/shopDecoration'),
        meta: {
          aliasName: 'shopdecoration',
          icon: 'icon-mobile',
          title: '766e6b00.40f82e',
          permissions: ['shopadmin.store.tmpl.shopdecoration']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/aftersales/detail'),
            meta: {
              title: '766e6b00.f6b1df',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'planting',
        path: 'planting',
        component: () => import('@/view/content/soft-article'),
        meta: {
          aliasName: 'planting',
          icon: 'icon-article',
          title: '766e6b00.e8f87a',
          permissions: ['shopadmin.store.planting']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/content/soft-article-id'),
            meta: {
              title: '766e6b00.d0acc7',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
