// 会员路由
const name = '统计'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/companydata',
  component: Layout,
  children: [
    {
      path: 'goodsstatistics',
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
      path: 'orderstatistics',
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
      path: 'distributordata',
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
      path: 'memberstatistics',
      name: `memberstatistics`,
      meta: {
        title: `${name}-会员统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-memberstatistics" */ '@/view/mall/datacube/companydata/member'
        )
    }
  ]
}
