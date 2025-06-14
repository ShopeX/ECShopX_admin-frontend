import { BasicLayout } from '@/layout/basic'
import SubLayout from '@/view/sublayout'

const routes = [
    {
        component: BasicLayout,
        meta: {
            aliasName: 'financial',
            icon: 'shopping-bag',
            keepAlive: true,
            title: '财务'
        },
        name: 'financial',
        path: '/financial',
        children: [
            {
                name: 'form',
                path: 'transaction/form',
                meta: {
                    aliasName: 'financialManageservicepayment',
                    icon: 'pay-circle',
                    title: '交易单',
                    permissions: ['financial.financialManage.financialManageservicepayment']
                },
                component: () => import('@/view/mall/trade/list')
            }, {
                name: 'form',
                path: 'refund/form',
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
            }, {
                name: 'failed',
                path: 'refund/failed',
                meta: {
                    aliasName: 'Refunderrorlogs',
                    icon: 'pay-circle',
                    title: '退款失败',
                    permissions: ['financial.financialManage.Refunderrorlogs']
                },
                component: () => import('@/view/mall/trade/refunderrorlogs')
            }, {
                name: 'summary',
                path: 'settlement/summary',
                meta: {
                    aliasName: 'summary',
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
            }, {
                name: 'configuration',
                path: 'settlement/configuration',
                meta: {
                    aliasName: 'configure',
                    icon: 'pay-circle',
                    title: '结算配置',
                    permissions: ['financial.settlement.configure']
                },
                component: () => import('@/view/financial/settlement/configure')
            },
            // {
            //     name: 'configuration',
            //     path: 'supplier-settlement/configuration',
            //     meta: {
            //         aliasName: 'configure_supplier',
            //         icon: 'pay-circle',
            //         title: '供应商结算配置',
            //         permissions: ['financial.settlement_supplier.configure_supplier']
            //     },
            //     component: () => import('@/'),
            // }, {
            //     name: 'summary',
            //     path: 'supplier-settlement/summary',
            //     meta: {
            //         aliasName: 'summary_supplier',
            //         icon: 'pay-circle',
            //         title: '供应商结算汇总',
            //         permissions: ['financial.settlement_supplier.summary_supplier']
            //     },
            //     component: () => import('@/'),
            // }, 
            {
                name: 'voucher-review',
                path: 'transfer/voucher-review',
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
                        // path: 'logs',
                        component: () => import('@/view/mall/trade/examineTransferLogs')
                    }
                ]
            },
        ]
    }
]

export default routes