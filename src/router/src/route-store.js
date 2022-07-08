// 会员路由
const name = '店铺'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/store',
  component: Layout,
  children: [
    {
      path: 'shop/Shopwxshop',
      name: `服务网店`,
      component: () => import('@/view/base/shop/wxshop'),
      children: [
        {
          path: 'editor/:wxShopId?',
          component: () => import('@/view/base/shop/editshop')
        }
      ]
    },
    {
      path: 'storemanager/marketingdistributor',
      name: `店铺列表`,
      component: () => import('@/view/mall/marketing/distributor'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/marketing/distributor_editor')
        },
        {
          path: 'template',
          component: () => import('@/view/mall/marketing/distributor_template')
        },
        {
          path: 'details/:id?',
          component: () => import('@/view/mall/marketing/distributor_details')
        },
        {
          path: 'wxpaysetting',
          component: () => import('@/view/mall/marketing/distributor_wxpaysetting')
        }
      ]
    },
    {
      path: 'storemanager/storeshopitemanagement',
      name: `店铺商品`,
      component: () => import('@/view/mall/storeshop/itemlist')
    },
    {
      path: 'storemanager/marketingdistribution_orders',
      name: `店铺订单`,
      component: () => import('@/view/mall/marketing/distributionOrders'),
      children: [
        {
          path: 'detail',
          component: () => import('@/view/mall/trade/order/detail')
        }
      ]
    },
    {
      path: 'storemanager/distributoraftersalesaddress',
      name: `售后地址`,
      component: () => import('@/view/mall/marketing/distributorAftersalesAddress')
    },
    {
      path: 'storemanager/exportstoreitems',
      name: `店铺商品更新`,
      component: () => import('@/view/mall/marketing/productUpdate')
    },
    {
      path: 'storemanager/marketinglog',
      name: `店铺记录`,
      component: () => import('@/view/mall/marketing/distributionLog')
    }
  ]
}
