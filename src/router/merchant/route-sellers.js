// 会员路由
const name = '商家'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/merchant/sellers',
  component: Layout,
  children: [
    {
      path: 'marketingdistributor',
      name: `店铺列表`,
      component: () => import('@/view/mall/marketing/distributor'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/merchant/store')
        },
        {
          path: 'template/:distributor_id?',
          component: () => import('@/view/mall/marketing/distributor_template')
        },
        {
          path: 'details/:id?',
          component: () => import('@/view/mall/marketing/distributor_details')
        },
        {
          path: 'wxpaysetting',
          component: () => import('@/view/mall/marketing/distributor_wxpaysetting')
        },
        {
          path: 'alipaysetting',
          component: () => import('@/view/mall/marketing/distributor_alipaysetting')
        }
      ]
    },
    {
      path: 'merchantinfo',
      name: `商家列表`,
      component: () => import('@/view/mall/marketing/merchantList/editor.vue')
    },


    {
      path: 'marketingsalesman',
      name: `业务员`,
      component: () => import('@/view/guide/salesman'),
      children: [
        {
          path: 'children', 
          component: () => import('@/view/guide/children')
        }
      ]
    }, 
    { 
      path: 'marketing/popularize/popularizedata',
      name: `业务员业绩`,
      component: () => import('@/view/popularize/data'),
      children: [
        {
          path: 'detail',
          component: () => import('@/view/popularize/brokerageLog')
        }
      ]
    },
    { 
      path: 'marketing/popularize/salesman/withdraw',
      name: `业务员提现`,
      component: () => import('@/view/mall/marketing/salesmanwithdraw')
    },    
    {
      path: 'popularize/popularizegoods',
      name: `分销商品`,
      component: () => import('@/view/popularize/goodsStore')
    },    
    {
      path: 'distributoraftersalesaddress',
      name: `售后地址`,
      component: () => import('@/view/mall/marketing/distributorAftersalesAddress')
    }
  ]
}
