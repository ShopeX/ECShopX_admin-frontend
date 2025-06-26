// 商家路由
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'sellers',
      icon: 'shop',
      keepAlive: true,
      title: '商家'
    },
    name: 'merchantSellers',
    path: '/merchant/sellers',
    children: [
      {
        name: 'merchantInfo',
        path: 'merchant-info',
        component: () => import('@/view/mall/marketing/merchantList/editor.vue'),
        meta: {
          aliasName: 'merchantinfo',
          icon: 'icon-merchant',
          title: '商家信息',
          permissions: ['sellers.merchantinfo']
        }
      },
      {
        name: 'storeList',
        path: 'store-list',
        component: () => import('@/view/mall/marketing/distributor'),
        meta: {
          aliasName: 'marketingdistributor',
          icon: 'icon-shop',
          title: '店铺列表',
          permissions: ['sellers.marketingdistributor']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/merchant/store'),
            meta: {
              title: '编辑店铺',
              hidden: true
            }
          },
          {
            path: 'template/:distributor_id?',
            component: () => import('@/view/mall/marketing/distributor_template'),
            meta: {
              title: '店铺模板',
              hidden: true
            }
          },
          {
            path: 'details/:id?',
            component: () => import('@/view/mall/marketing/distributor_details'),
            meta: {
              title: '店铺详情',
              hidden: true
            }
          },
          {
            path: 'wxpaysetting',
            component: () => import('@/view/mall/marketing/distributor_wxpaysetting'),
            meta: {
              title: '微信支付设置',
              hidden: true
            }
          },
          {
            path: 'alipaysetting',
            component: () => import('@/view/mall/marketing/distributor_alipaysetting'),
            meta: {
              title: '支付宝设置',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'afterSalesAddress',
        path: 'aftersales-address',
        component: () => import('@/view/mall/marketing/distributorAftersalesAddress'),
        meta: {
          aliasName: 'distributoraftersalesaddress',
          icon: 'icon-address',
          title: '售后地址',
          permissions: ['sellers.distributoraftersalesaddress']
        }
      },
      {
        name: 'popularizeGoods',
        path: 'popularize-goods',
        component: () => import('@/view/popularize/goodsStore'),
        meta: {
          aliasName: 'popularizegoods',
          icon: 'icon-goods',
          title: '分销商品池',
          permissions: ['sellers.popularizegoods']
        }
      },
      {
        name: 'marketingSalesman',
        path: 'marketing-salesman',
        component: () => import('@/view/guide/salesman'),
        meta: {
          aliasName: 'marketingsalesman',
          icon: 'icon-salesman',
          title: '业务员',
          permissions: ['sellers.marketingsalesman']
        },
        children: [
          {
            path: 'children',
            component: () => import('@/view/guide/children'),
            meta: {
              title: '业务员下级',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'popularizeData',
        path: 'popularize-data',
        component: () => import('@/view/popularize/data'),
        meta: {
          aliasName: 'popularizedata',
          icon: 'icon-data',
          title: '业务员业绩',
          permissions: ['sellers.popularizedata']
        },
        children: [
          {
            path: 'detail',
            component: () => import('@/view/popularize/brokerageLog'),
            meta: {
              title: '业绩详情',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'popularizeWithdraw',
        path: 'popularize-withdraw',
        component: () => import('@/view/mall/marketing/salesmanwithdraw'),
        meta: {
          aliasName: 'popularizewithdraw',
          icon: 'icon-withdraw',
          title: '业务员提现',
          permissions: ['sellers.popularizewithdraw']
        }
      }
    ]
  }
]

export default routes
