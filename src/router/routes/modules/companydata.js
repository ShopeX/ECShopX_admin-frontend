import { BasicLayout } from '@/layout/basic'
import SubLayout from '@/view/sublayout'

const routes = [
    {
        component: BasicLayout,
        meta: {
            aliasName: 'companydata',
            icon: 'shopping-bag',
            keepAlive: true,
            title: '装修'
        },
        name: 'companydata',
        path: '/companydata',
        children:[
            {
                name: 'statistics',
                path: 'product/statistics',
                meta: {
                    aliasName: 'goodsstatistics',
                    icon: 'pay-circle',
                    title: '商品统计',
                    permissions: ['companydata.statistics.goodsstatistics']
                },
                component: () => import('@/view/mall/datacube/goodsdata'),
            },{
                name: 'statistics',
                path: 'transaction/statistics',
                meta: {
                    aliasName: 'orderstatistics',
                    icon: 'pay-circle',
                    title: '交易统计',
                    permissions: ['companydata.statistics.orderstatistics']
                },
                component: () => import('@/view/mall/datacube/companydata/order'),
            },{
                name: 'statistics',
                path: 'membership/statistics',
                meta: {
                    aliasName: 'member-statistics',
                    icon: 'pay-circle',
                    title: '会员统计',
                    permissions: ['companydata.statistics.member-statistics']
                },
                component: () => import('@/view/mall/datacube/companydata/member'),
            },{
                name: 'statistics',
                path: 'store/statistics',
                meta: {
                    aliasName: 'distributordata',
                    icon: 'pay-circle',
                    title: '店铺统计',
                    permissions: ['companydata.statistics.distributordata']
                },
                component: () => import('@/view/mall/datacube/distributordata'),
            },{
                name: 'record',
                path: 'export-record',
                meta: {
                    aliasName: 'baseexport',
                    icon: 'pay-circle',
                    title: '导出记录',
                    permissions: ['companydata.report.baseexport']
                },
                component: () => import('@/view/base/exportlog/index')
            },
        ]
    }
]

export default routes