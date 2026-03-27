/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'financial',
      icon: 'funds',
      keepAlive: true,
      title: 'a38a4db1.b8fe8d'
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
          title: 'a38a4db1.8ab066',
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
          title: 'a38a4db1.51e9e1',
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
          title: 'a38a4db1.7c2544',
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
          title: 'a38a4db1.3965e5',
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
          title: 'a38a4db1.070f26',
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
          title: 'a38a4db1.385f74',
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
          title: 'a38a4db1.4c48e9',
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
          title: 'a38a4db1.682360',
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
          title: 'a38a4db1.d16abb',
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
          title: 'a38a4db1.bcd859',
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
          title: 'a38a4db1.91d8a5',
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
          title: 'a38a4db1.e4a771',
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
          title: 'a38a4db1.30117a',
          permissions: ['financial.invoice.invoiceConfirmation']
        },
        component: () => import('@/view/financial/invoice/invoiceConfirmation')
      }
    ]
  }
]

export default routes
