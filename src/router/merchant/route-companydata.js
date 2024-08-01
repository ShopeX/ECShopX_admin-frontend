// 会员路由
const name = '统计'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/merchant/companydata',
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
      path: 'deliverystaffstatistics',
      name: `deliverystaffstatistics`,
      meta: {
        title: `${name}-配送员业绩`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-memberstatistics" */ '@/view/mall/datacube/companydata/delivery'
        )
    },
    {
      path: 'accountingStatistics',
      name: `accountingStatistics`,
      meta: {
        title: `${name}-分账统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-accountingStatistics" */ '@/view/mall/datacube/accountingstatistics'
        ),
      children: [
        {
          path: 'detail/:itemId?',
          meta: {
            title: `${name}-分账统计-查看`
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
      name: `cashRecord`,
      meta: {
        title: `${name}-提现记录`
      },
      component: () =>
        import(/* webpackChunkName: "companydata-cashrecord" */ '@/view/mall/datacube/cashrecord')
    },
    {
      path: 'transactionStatistics',
      name: `transactionStatistics`,
      meta: {
        title: `${name}-店铺交易统计`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-transactionStatistics" */ '@/view/mall/marketing/transactionStatistics'
        )
    },
    {
      path: 'SalemanLoginHistory',
      name: `SalemanLoginHistory`,
      meta: {
        title: `${name}-导购签到记录`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-SalemanLoginHistory" */ '@/view/guide/SalemanLoginHistory'
        )
    },
    {
      path: 'marketingsalesman',
      name: `marketingsalesman`,
      meta: {
        title: `${name}-店铺导购员`
      },
      component: () =>
        import(/* webpackChunkName: "companydata-marketingsalesman" */ '@/view/guide/salesman')
    },
    {
      path: 'coupongrantset',
      name: `coupongrantset`,
      meta: {
        title: `${name}-优惠券发放设置`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-coupongrantset" */ '@/view/member/cardticket/couponGrantSet'
        )
    },
    {
      path: 'shopactivities',
      name: `shopactivities`,
      meta: {
        title: `${name}-导购知识库`
      },
      component: () =>
        import(/* webpackChunkName: "companydata-shopactivities" */ '@/view/guide/shopactivities'),
      children: [
        {
          path: 'editor/:itemId?',
          meta: {
            title: `${name}-导购知识库-编辑`
          },
          component: () =>
            import(
              /* webpackChunkName: "companydata-shopactivities-editor" */ '@/view/guide/shopActivities_editor'
            )
        }
      ]
    },
    {
      path: 'shoppingguidenotification',
      name: `shoppingguidenotification`,
      meta: {
        title: `${name}-导购员通知`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-shoppingguidenotification" */ '@/view/guide/shoppingguidenotification'
        ),
      children: [
        {
          path: 'editor/:itemId?',
          meta: {
            title: `${name}-导购员通知-编辑`
          },
          component: () =>
            import(
              /* webpackChunkName: "companydata-shoppingguidenotification-editor" */ '@/view/guide/shoppingguidenotification_editor'
            )
        }
      ]
    },
    {
      path: 'profitlist',
      name: `profitlist`,
      meta: {
        title: `${name}-业绩统计`
      },
      component: () =>
        import(/* webpackChunkName: "companydata-profitlist" */ '@/view/mall/profit/list')
    },
    {
      path: 'salemancustomercomplaints',
      name: `salemancustomercomplaints`,
      meta: {
        title: `${name}-导购员投诉`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-salemancustomercomplaints" */ '@/view/guide/salemanCustomerComplaints'
        )
    },
    {
      path: 'guide/qywx/addressBook',
      name: `guide_qywx_addressBook`,
      meta: {
        title: `${name}-企业微信-通讯录`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-guide-qywx-addressBook" */ '@/view/base/setting/addressBook/index'
        )
    },
    {
      path: 'financial/settlement/summary',
      name: `结算汇总`,
      component: () => import('@/view/financial/settlement/summary'),
      children: [
        {
          path: 'detail/:id?',
          component: () => import('@/view/financial/settlement/detailed')
        }
      ]
    }
  ]
}
