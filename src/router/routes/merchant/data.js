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

// 统计路由
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'companydata',
      icon: 'internal-data',
      keepAlive: true,
      title: '统计'
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
          title: '交易统计',
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
          title: '店铺统计',
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
          title: '商品统计',
          permissions: ['companydata.goodsstatistics']
        }
      },
      {
        name: 'settlementSummary',
        path: 'statistics/settlement-summary',
        meta: {
          aliasName: 'summary',
          icon: 'pay-circle',
          title: '结算汇总',
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
          title: '配送员业绩',
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
          title: '分账统计',
          permissions: ['companydata.accountingstatistics']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/datacube/accountingstatistics_detail'),
            meta: {
              title: '分账统计详情',
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
          title: '提现记录',
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
          title: '店铺交易统计',
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
          title: '导购签到记录',
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
          title: '店铺导购员',
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
          title: '优惠券发放设置',
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
          title: '导购知识库',
          permissions: ['companydata.shopactivities']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/guide/shopActivities_editor'),
            meta: {
              title: '编辑知识库',
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
          title: '导购员通知',
          permissions: ['companydata.shoppingguidenotification']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/guide/shoppingguidenotification_editor'),
            meta: {
              title: '编辑通知',
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
          title: '业绩统计',
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
          title: '导购员投诉',
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
          title: '企业微信-通讯录',
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
          title: '结算汇总',
          permissions: ['companydata.financial.settlement.summary']
        },
        children: [
          {
            path: 'detail/:id?',
            component: () => import('@/view/financial/settlement/detailed'),
            meta: {
              title: '结算详情',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
