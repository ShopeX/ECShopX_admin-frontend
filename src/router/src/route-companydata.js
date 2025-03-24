// 会员路由
const name = '统计'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/companydata',
  component: Layout,
  children: [
    {
      path: 'statistics/goodsstatistics',
      name: `goodsstatistics`,
      meta: {
        title: `${name}-商品统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-goodsstatistics" */ '@/view/mall/datacube/goodsdata'
        )
    },
    {
      path: 'statistics/orderstatistics',
      name: `orderstatistics`,
      meta: {
        title: `${name}-交易统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-orderstatistics" */ '@/view/mall/datacube/companydata/order'
        )
    },
    {
      path: 'statistics/distributordata',
      name: `distributordata`,
      meta: {
        title: `${name}-店铺统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-distributordata" */ '@/view/mall/datacube/distributordata'
        )
    },
    {
      path: 'statistics/memberstatistics',
      name: `memberstatistics`,
      meta: {
        title: `${name}-会员统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-memberstatistics" */ '@/view/mall/datacube/companydata/member'
        )
    },
    {
      path: 'report/baseexport',
      name: `导出列表`,
      component: () => import('@/view/base/exportlog/index')
    }
  ]
}
