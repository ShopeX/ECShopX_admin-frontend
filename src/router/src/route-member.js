// 会员路由
const name = '会员'
import Layout from '@/view/layout' // 主框架
import { VERSION_IN_PURCHASE } from '@/utils'

export default {
  path: '/member',
  component: Layout,
  children: [
    {
      path: 'member',
      name: `会员列表`,
      component: () => import('@/view/member/members/list'),
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
      name: `等级管理`,
      component: () => import('@/view/member/level')
    },
    {
      path: 'card/managecardorder',
      name: `等级购买记录`,
      component: () => import('@/view/member/membercard/list')
    },
    {
      path: 'Membertagcategory',
      name: `会员标签分组`,
      component: () => import('@/view/member/members/tagcategory.vue')
    },
    {
      path: 'whitelistlist',
      name: `白名单列表`,
      component: () => {
        if (VERSION_IN_PURCHASE) {
          return import('@/view/member/whitelist/list.purchase')
        } else {
          return import('@/view/member/whitelist/list')
        }
      }
    },
    {
      path: 'whitelistuploade',
      name: `白名单导入`,
      component: () => import('@/view/member/whitelist/uploadeindex')
    },
    {
      path: 'pointrule',
      name: `积分规则`,
      component: () => import('@/view/member/point/index.vue')
    },
    {
      path: 'pointoverview',
      name: `积分总览`,
      component: () => import('@/view/member/point/overview.vue')
    },
    {
      path: 'analysisrights',
      name: `会员权益`,
      component: () => import('@/view/member/members/rightsList')
    },
    {
      path: 'Managetag',
      name: `会员标签`,
      component: () => import('@/view/member/members/tags')
    },
    {
      path: 'smssend',
      name: `群发短信`,
      component: () => import('@/view/member/members/list')
    },
    {
      path: 'Manageinfomation',
      name: `会员注册信息`,
      component: () => import('@/view/member/register')
    },
    {
      path: 'salemanprotocol',
      name: `业务员协议`,
      component: () => import('@/view/member/salemanprotocol')
    },
    {
      path: 'mallrecharge',
      name: `会员储值`,
      component: () => import('@/view/mall/storeddeposit/index')
    },
    {
      path: 'managecustomer',
      name: `会员信息导入`,
      component: () => import('@/view/member/members/uploade')
    },
    {
      path: 'trustlogin',
      name: `信任登录`,
      component: () => import('@/view/member/trustlogin/list')
    },
    {
      path: 'closeAccount',
      name: '会员注销',
      component: () => import('@/view/member/logout')
    },
    // {
    //   path: 'enterpriselist',
    //   name: '内购企业列表',
    //   component: () => import('@/view/member/members/enterprise')
    // },
    {
      path: 'purchase/employee',
      name: '员工管理',
      component: () => import('@/view/member/purchase/employee'),
      children: [
        {
          path: 'import',
          name: `白名单导入`,
          component: () => import('@/view/member/purchase/employeeImport')
        }
      ]
    },

    {
      path: 'purchase/company',
      name: '企业管理',
      component: () => import('@/view/member/purchase/company')
    }
  ]
}
