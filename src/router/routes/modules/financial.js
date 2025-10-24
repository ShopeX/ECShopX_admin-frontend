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

import { BasicLayout } from '@/layout/basic'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'financial',
      icon: 'funds',
      keepAlive: true,
      title: '财务'
    },
    name: 'financial',
    path: '/financial',
    children: [
      {
        name: 'transactionList',
        path: 'transaction-flow/transaction-list',
        meta: {
          aliasName: 'financialManageservicepayment',
          icon: 'pay-circle',
          title: '交易单',
          permissions: ['financial.financialManage.financialManageservicepayment']
        },
        component: () => import('@/view/mall/trade/list')
      },
      {
        name: 'refundList',
        path: 'transaction-flow/refund-list',
        meta: {
          aliasName: 'financialFinancialManageAftersalesrefundlist',
          icon: 'pay-circle',
          title: '退款单',
          permissions: ['financial.financialManage.financialFinancialManageAftersalesrefundlist']
        },
        component: () => import('@/view/mall/aftersales/refundList'),
        children: [
          {
            path: 'detail',
            component: () => import('@/view/mall/aftersales/refundDetail')
          }
        ]
      },
      {
        name: 'refundFailed',
        path: 'transaction-flow/refund-failed',
        meta: {
          aliasName: 'Refunderrorlogs',
          icon: 'pay-circle',
          title: '退款失败',
          permissions: ['financial.financialManage.Refunderrorlogs']
        },
        component: () => import('@/view/mall/trade/refunderrorlogs')
      },
      {
        name: 'settlementConfiguration',
        path: 'settlement/configuration',
        meta: {
          aliasName: 'configure',
          icon: 'pay-circle',
          title: '结算配置',
          permissions: ['financial.settlement.configure']
        },
        component: () => import('@/view/financial/settlement/configure')
      },
      {
        name: 'settlementSummary',
        path: 'settlement/summary',
        meta: {
          aliasName: 'configure_supplier',
          icon: 'pay-circle',
          title: '结算汇总',
          permissions: ['financial.settlement.summary']
        },
        component: () => import('@/view/financial/settlement/summary'),
        children: [
          {
            path: 'detail/:id?',
            component: () => import('@/view/financial/settlement/detailed')
          }
        ]
      },

      {
        name: 'supplierSettlementConfiguration',
        path: 'supplier-settlement/configuration',
        meta: {
          aliasName: 'configure_supplier',
          icon: 'pay-circle',
          title: '供应商结算配置',
          permissions: ['financial.settlement_supplier.configure_supplier']
        },
        component: () => import('@/views/financial/configure_supplier')
      },
      {
        name: 'supplierSettlementSummary',
        path: 'supplier-settlement/summary',
        meta: {
          aliasName: 'summary_supplier',
          icon: 'pay-circle',
          title: '供应商结算汇总',
          permissions: ['financial.settlement_supplier.summary_supplier']
        },
        component: () => import('@/views/financial/summary_supplier'),
        children: [
          {
            path: 'detail/:id?',
            component: () => import('@/views/financial/detailed')
          }
        ]
      },

      {
        name: 'voucherReview',
        path: 'offline-transfer/voucher-review',
        meta: {
          aliasName: 'transfer',
          icon: 'pay-circle',
          title: '转账凭证审核',
          permissions: ['financial.examine.transfer']
        },
        component: () => import('@/view/mall/trade/examineTransfer'),
        children: [
          {
            path: 'logs/:id?',
            component: () => import('@/view/mall/trade/examineTransferLogs')
          }
        ]
      },
      {
        name: 'invoiceList',
        path: 'invoice/invoice-list',
        meta: {
          aliasName: 'invoiceList',
          icon: 'pay-circle',
          title: '开票申请',
          permissions: ['financial.invoice.invoice-list']
        },
        component: () => import('@/view/financial/invoice/list'),
        children: [
          {
            path: 'detail/:id?',
            component: () => import('@/view/financial/invoice/detail')
          },
          {
            path: 'process/:itemId?',
            component: () => import('@/view/financial/invoice/process')
          }
        ]
      },
      {
        name: 'invoiceSetting',
        path: 'invoice/invoice-setting',
        meta: {
          aliasName: 'invoiceSetting',
          icon: 'pay-circle',
          title: '发票配置',
          permissions: ['financial.invoice.invoiceSetting']
        },
        component: () => import('@/view/financial/invoice/setting')
      },
      {
        name: 'sellerInformation',
        path: 'invoice/seller-information',
        meta: {
          aliasName: 'invoiceInfo',
          icon: 'pay-circle',
          title: '销方信息',
          permissions: ['financial.invoice.invoiceInfo']
        },
        component: () => import('@/view/financial/invoice/information')
      },
      {
        name: 'invoiceTax',
        path: 'invoice/invoice-tax',
        meta: {
          aliasName: 'invoiceTax',
          icon: 'pay-circle',
          title: '开票税率',
          permissions: ['financial.invoice.invoiceTax']
        },
        component: () => import('@/view/financial/invoice/invoiceTax')
      },
      {
        name: 'invoiceConfirmation',
        path: 'invoice/invoice-confirmation',
        meta: {
          aliasName: 'invoiceConfirmation',
          icon: 'pay-circle',
          title: '专票确认书',
          permissions: ['financial.invoice.invoiceConfirmation']
        },
        component: () => import('@/view/financial/invoice/invoiceConfirmation')
      }
    ]
  }
]

export default routes
