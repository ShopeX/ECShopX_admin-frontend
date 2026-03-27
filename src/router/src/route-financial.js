/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '45b0dfb2.b8fe8d'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/financial',
  component: Layout,
  children: [
    {
      path: 'financialManage/servicepayment',
      name: '45b0dfb2.8ab066',
      component: () => import('@/view/mall/trade/list')
    },
    {
      path: 'financialManage/aftersalesrefundlist',
      name: '45b0dfb2.51e9e1',
      component: () => import('@/view/mall/aftersales/refundList'),
      children: [
        {
          path: 'detail',
          component: () => import('@/view/mall/aftersales/refundDetail')
        }
      ]
    },
    {
      path: 'financialManage/Refunderrorlogs',
      name: '45b0dfb2.ea0ea2',
      component: () => import('@/view/mall/trade/refunderrorlogs')
    },
    {
      path: 'financialManage/financialaftersaleslist',
      name: '45b0dfb2.d1b93f',
      component: () => import('@/view/mall/aftersales/financial/list')
    },

    {
      path: 'financialManage/salesreportlist',
      name: '45b0dfb2.87821b',
      component: () => import('@/view/mall/trade/financial/list')
    },
    {
      path: 'examine/transfer',
      name: '45b0dfb2.2799ad',
      component: () => import('@/view/mall/trade/examineTransfer'),
      children: [
        {
          path: 'logs/:id?',
          // path: 'logs',
          component: () => import('@/view/mall/trade/examineTransferLogs')
        }
      ]
    },

    {
      path: 'splitBill/setting',
      name: '45b0dfb2.b6453a',
      component: () => import('@/view/mall/splitbill/setting')
    },
    {
      path: 'splitBill/StoreInformation',
      name: '45b0dfb2.db2648',
      component: () => import('@/view/mall/splitbill/list'),
      children: [
        {
          path: 'editor',
          component: () => import('@/view/mall/splitbill/edit')
        }
      ]
    },
    {
      path: 'splitBill/StoreFenSetting',
      name: '45b0dfb2.358784',
      component: () => import('@/view/mall/splitbill/storesetting')
    },
    // {
    //   path: 'adapay_merchant_info',
    //   name: `开户信息`,
    //   component: () => import('@/view/mall/accountopeninfo')
    // },
    {
      path: 'adapay_member_audit',
      name: '45b0dfb2.5bf3b3',
      component: () => import('@/view/mall/marketing/openingapproval'),
      children: [
        {
          path: 'approve/:id?',
          component: () => import('@/view/mall/marketing/openingapproval/approve')
        }
      ]
    },
    {
      path: 'settlement/summary',
      name: '45b0dfb2.070f26',
      component: () => import('@/view/financial/settlement/summary'),
      children: [
        {
          path: 'detail/:id?',
          component: () => import('@/view/financial/settlement/detailed')
        }
      ]
    },
    {
      path: 'settlement/configure',
      name: '45b0dfb2.3965e5',
      component: () => import('@/view/financial/settlement/configure')
    },
    {
      path: 'invoice/invoiceManagement',
      name: '45b0dfb2.a4bb2f',
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
      path: 'invoice/invoiceSetting',
      name: '45b0dfb2.bcd859',
      component: () => import('@/view/financial/invoice/setting')
    },
    {
      path: 'invoice/invoiceInfo',
      name: '45b0dfb2.131871',
      component: () => import('@/view/financial/invoice/information')
    },
    {
      path: 'invoice/invoiceTax',
      name: '45b0dfb2.e4a771',
      component: () => import('@/view/financial/invoice/invoiceTax')
    },
    {
      path: 'invoice/invoiceConfirmation',
      name: '45b0dfb2.30117a',
      component: () => import('@/view/financial/invoice/invoiceConfirmation')
    }
  ]
}
