// 会员路由
const name = '财务'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/financial',
  component: Layout,
  children: [
    {
      path: 'financialManage/servicepayment',
      name: `交易单`,
      component: () => import('@/view/mall/trade/list')
    },
    {
      path: 'financialManage/aftersalesrefundlist',
      name: `退款单`,
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
      name: `退款失败日志`,
      component: () => import('@/view/mall/trade/refunderrorlogs')
    },
    {
      path: 'financialManage/financialaftersaleslist',
      name: `售后单`,
      component: () => import('@/view/mall/aftersales/financial/list')
    },

    {
      path: 'financialManage/salesreportlist',
      name: `销售报表`,
      component: () => import('@/view/mall/trade/financial/list')
    },
    {
      path: 'examine/transfer',
      name: `转账审核`,
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
      name: `基础配置`,
      component: () => import('@/view/mall/splitbill/setting')
    },
    {
      path: 'splitBill/StoreInformation',
      name: `店铺进件信息`,
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
      name: `商户提现设置`,
      component: () => import('@/view/mall/splitbill/storesetting')
    },
    {
      path: 'distribution/dada',
      name: `达达账户`,
      component: () => import('@/view/mall/distribution/account')
    },
    // {
    //   path: 'adapay_merchant_info',
    //   name: `开户信息`,
    //   component: () => import('@/view/mall/accountopeninfo')
    // },
    {
      path: 'adapay_member_audit',
      name: `开户审批`,
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
      name: `结算汇总`,
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
      name: `结算配置`,
      component: () => import('@/view/financial/settlement/configure')
    }
  ]
}
