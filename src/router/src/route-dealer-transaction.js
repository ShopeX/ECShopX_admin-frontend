/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '7220bd7c.266714'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/dealer/trades',
  component: Layout,
  children: [
    {
      path: 'adapay_trades',
      name: '7220bd7c.98818a',
      component: () => import('@/view/mall/sub_account/sub_account'),
      children: [
        {
          path: 'detail/:order_id',
          component: () => import('@/view/mall/sub_account/detail')
        }
      ]
    },
    {
      path: 'adapay_cash',
      name: '7220bd7c.db7971',
      component: () => import('@/view/mall/withdraw/withdraw')
    }
  ]
}
