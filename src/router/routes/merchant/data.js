/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'companydata',
      icon: 'internal-data',
      keepAlive: true,
      title: '6a7a6499.d7656a'
    },
    name: 'merchantCompanydata',
    path: '/merchant/companydata',
    children: [
      {
        name: 'transactionStatistics',
        path: 'statistics/transaction-Statistics',
        component: () => import('@/view/mall/datacube/companydata/order'),
        meta: {
          aliasName: 'orderstatistics',
          icon: 'icon-order',
          title: '6a7a6499.9dbf41',
          permissions: ['companydata.orderstatistics']
        }
      },
      {
        name: 'storeStatistics',
        path: 'statistics/store-statistics',
        component: () => import('@/view/mall/datacube/distributordata'),
        meta: {
          aliasName: 'distributordata',
          icon: 'icon-shop',
          title: '6a7a6499.63cf82',
          permissions: ['companydata.distributordata']
        }
      },
      {
        name: 'productStatistics',
        path: 'statistics/product-statistics',
        component: () => import('@/view/mall/datacube/goodsdata'),
        meta: {
          aliasName: 'goodsstatistics',
          icon: 'icon-goods',
          title: '6a7a6499.c38352',
          permissions: ['companydata.goodsstatistics']
        }
      },
      {
        name: 'settlementSummary',
        path: 'statistics/settlement-summary',
        meta: {
          aliasName: 'summary',
          icon: 'pay-circle',
          title: '6a7a6499.070f26',
          permissions: ['companydata.settlement.summary']
        },
        component: () => import('@/view/financial/settlement/summary')
      },
      {
        path: 'deliveryStaff',
        name: `statistics/delivery-staff`,
        component: () => import('@/view/mall/datacube/companydata/delivery'),
        meta: {
          aliasName: 'merchant_companydata_deliverystaffstatistics',
          icon: 'icon-delivery',
          title: '6a7a6499.d6f79b',
          permissions: ['companydata.merchant_companydata_deliverystaffstatistics']
        }
      },

      // TODO: 路由后期优化
      {
        name: 'accountingStatistics',
        path: 'accountingStatistics',
        component: () => import('@/view/mall/datacube/accountingstatistics'),
        meta: {
          aliasName: 'accountingstatistics',
          icon: 'icon-accounting',
          title: '6a7a6499.a0e20d',
          permissions: ['companydata.accountingstatistics']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/datacube/accountingstatistics_detail'),
            meta: {
              title: '6a7a6499.151685',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'cashRecord',
        path: 'cashRecord',
        component: () => import('@/view/mall/datacube/cashrecord'),
        meta: {
          aliasName: 'cashrecord',
          icon: 'icon-cash',
          title: '6a7a6499.103053',
          permissions: ['companydata.cashrecord']
        }
      },
      {
        name: 'transactionStatistics',
        path: 'transactionStatistics',
        component: () => import('@/view/mall/marketing/transactionStatistics'),
        meta: {
          aliasName: 'transactionstatistics',
          icon: 'icon-transaction',
          title: '6a7a6499.29b09e',
          permissions: ['companydata.transactionstatistics']
        }
      },
      {
        name: 'salemanLoginHistory',
        path: 'SalemanLoginHistory',
        component: () => import('@/view/guide/SalemanLoginHistory'),
        meta: {
          aliasName: 'salemanloginhistory',
          icon: 'icon-login',
          title: '6a7a6499.51d6c2',
          permissions: ['companydata.salemanloginhistory']
        }
      },
      {
        name: 'marketingSalesman',
        path: 'marketingsalesman',
        component: () => import('@/view/guide/salesman'),
        meta: {
          aliasName: 'marketingsalesman',
          icon: 'icon-salesman',
          title: '6a7a6499.209e3b',
          permissions: ['companydata.marketingsalesman']
        }
      },
      {
        name: 'couponGrantSet',
        path: 'coupongrantset',
        component: () => import('@/view/member/cardticket/couponGrantSet'),
        meta: {
          aliasName: 'coupongrantset',
          icon: 'icon-coupon',
          title: '6a7a6499.0585e2',
          permissions: ['companydata.coupongrantset']
        }
      },
      {
        name: 'shopActivities',
        path: 'shopactivities',
        component: () => import('@/view/guide/shopactivities'),
        meta: {
          aliasName: 'shopactivities',
          icon: 'icon-activity',
          title: '6a7a6499.ea8541',
          permissions: ['companydata.shopactivities']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/guide/shopActivities_editor'),
            meta: {
              title: '6a7a6499.0fabdb',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'shoppingGuideNotification',
        path: 'shoppingguidenotification',
        component: () => import('@/view/guide/shoppingguidenotification'),
        meta: {
          aliasName: 'shoppingguidenotification',
          icon: 'icon-notification',
          title: '6a7a6499.de94d9',
          permissions: ['companydata.shoppingguidenotification']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/guide/shoppingguidenotification_editor'),
            meta: {
              title: '6a7a6499.afe31d',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'profitList',
        path: 'profitlist',
        component: () => import('@/view/mall/profit/list'),
        meta: {
          aliasName: 'profitlist',
          icon: 'icon-profit',
          title: '6a7a6499.398e76',
          permissions: ['companydata.profitlist']
        }
      },
      {
        name: 'salemanCustomerComplaints',
        path: 'salemancustomercomplaints',
        component: () => import('@/view/guide/salemanCustomerComplaints'),
        meta: {
          aliasName: 'salemancustomercomplaints',
          icon: 'icon-complaint',
          title: '6a7a6499.dc1e9e',
          permissions: ['companydata.salemancustomercomplaints']
        }
      },
      {
        name: 'guideQywxAddressBook',
        path: 'guide/qywx/addressBook',
        component: () => import('@/view/base/setting/addressBook/index'),
        meta: {
          aliasName: 'guideqywxaddressbook',
          icon: 'icon-addressbook',
          title: '6a7a6499.309dd8',
          permissions: ['companydata.guide.qywx.addressbook']
        }
      },
      {
        name: 'financialSettlementSummary',
        path: 'financial/settlement/summary',
        component: () => import('@/view/financial/settlement/summary'),
        meta: {
          aliasName: 'financialsettlementsummary',
          icon: 'icon-settlement',
          title: '6a7a6499.070f26',
          permissions: ['companydata.financial.settlement.summary']
        },
        children: [
          {
            path: 'detail/:id?',
            component: () => import('@/view/financial/settlement/detailed'),
            meta: {
              title: '6a7a6499.8cce7c',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
