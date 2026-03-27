/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Layout from '@/view/layout' // 主框架
import { VERSION_IN_PURCHASE } from '@/utils'

export default {
  path: '/member',
  component: Layout,
  children: [
    {
      path: 'member/memberlist',
      name: 'd251b20e.5386bb',
      component: () => import('@/views/members/member_list'),
      children: [
        {
          path: 'detail/:user_id?',
          component: () => import('@/view/member/members/detail')
        },
        {
          path: 'chiefupload',
          component: () => import('@/view/member/members/upload_chief')
        }
      ]
    },
    {
      path: 'card/managecard',
      name: 'd251b20e.481b69',
      component: () => import('@/view/member/level')
    },
    {
      path: 'card/managecardorder',
      name: 'd251b20e.d2a32f',
      component: () => import('@/view/member/membercard/list')
    },
    {
      path: 'Membertagcategory',
      name: 'd251b20e.4ad5cb',
      component: () => import('@/view/member/members/tagcategory.vue')
    },
    {
      path: 'whitelistlist',
      name: 'd251b20e.389be0',
      component: () => {
        if (VERSION_IN_PURCHASE()) {
          return import('@/view/member/whitelist/list.purchase')
        } else {
          return import('@/view/member/whitelist/list')
        }
      }
    },
    {
      path: 'whitelistuploade',
      name: 'd251b20e.eba44e',
      component: () => import('@/view/member/whitelist/uploadeindex')
    },
    {
      path: 'card/pointrule',
      name: 'd251b20e.09d011',
      component: () => import('@/view/member/point/index.vue')
    },
    {
      path: 'card/pointoverview',
      name: 'd251b20e.908dab',
      component: () => import('@/view/member/point/overview.vue')
    },
    {
      path: 'analysisrights',
      name: 'd251b20e.de4753',
      component: () => import('@/view/member/members/rightsList')
    },
    {
      path: 'member/Managetag',
      name: 'd251b20e.3cc026',
      component: () => import('@/view/member/members/tags')
    },
    {
      path: 'membertouch/smssend',
      name: 'd251b20e.43e10b',
      component: () => import('@/views/members/member_list')
    },
    {
      path: 'membertouch/arrivalnotice',
      name: 'd251b20e.46a6b2',
      component: () => import('@/view/goods/arrivalNotice')
    },
    {
      path: 'membersetting/Manageinfomation',
      name: 'd251b20e.91fb53',
      component: () => import('@/view/member/register')
    },
    {
      path: 'salemanprotocol',
      name: 'd251b20e.6f717b',
      component: () => import('@/view/member/salemanprotocol')
    },
    {
      path: 'mallrecharge',
      name: 'd251b20e.ba4d7a',
      component: () => import('@/view/mall/storeddeposit/index')
    },
    {
      path: 'member/managecustomer',
      name: 'd251b20e.bb0a54',
      component: () => import('@/view/member/members/uploade')
    },
    {
      path: 'membersetting/trustlogin',
      name: 'd251b20e.7c7579',
      component: () => import('@/view/member/trustlogin/list')
    },
    {
      path: 'membersetting/closeAccount',
      name: 'd251b20e.76c5fa',
      component: () => import('@/view/member/logout')
    }
    // {
    //   path: 'enterpriselist',
    //   name: '内购企业列表',
    //   component: () => import('@/view/member/members/enterprise')
    // },
  ]
}
