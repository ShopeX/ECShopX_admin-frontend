// 商品路由
const name = '报表'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin/statistics',
  component: Layout,
  children: [
    {
      path: 'distributordata',
      name: `店铺统计`,
      component: () => import('@/view/mall/datacube/distributordata')
    },
    // {
    //   path: 'accountingStatistics',
    //   name: `店铺分账统计`,
    //   component: () => import( '@/view/mall/splitbill/storeAccount' )
    // },
    {
      path: 'accountingStatistics',
      name: `店铺分账统计`,
      meta: {
        title: `分账统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-accountingStatistics" */ '@/view/mall/datacube/accountingstatistics'
        ),
      children: [
        {
          path: 'detail/:itemId?',
          meta: {
            title: `分账统计-查看`
          },
          component: () =>
            import(
              /* webpackChunkName: "companydata-accountingStatistics-detail" */ '@/view/mall/datacube/accountingstatistics_detail'
            )
        }
      ]
    },
    {
      path: 'cashRecord',
      name: `提现记录`,
      component: () => import('@/view/mall/datacube/cashrecord')
    }
    // {
    //   path: 'accountingStatistics',
    //   name: `accountingStatistics`,
    //   component: () =>import('@/view/mall/splitbill/storeAccount')
    // },
  ]
}
