/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic'
import { VERSION_IN_PURCHASE } from '@/utils'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'member',
      icon: 'light-member',
      keepAlive: true,
      title: '3ed22e5e.4d9dd5'
    },
    name: 'member',
    path: '/members',
    children: [
      {
        name: 'memberList',
        path: 'member-manage/member-list',
        meta: {
          aliasName: 'memberlist',
          icon: 'pay-circle',
          title: '3ed22e5e.5386bb',
          permissions: ['member.memberlmana.memberlist']
        },
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
        name: 'batchUpdate',
        path: 'member-manage/batch-update',
        meta: {
          aliasName: 'managecustomer',
          icon: 'pay-circle',
          title: '3ed22e5e.463e2b',
          permissions: ['member.memberlmana.managecustomer']
        },
        component: () => import('@/view/member/members/uploade')
      },
      {
        name: 'memberTags',
        path: 'member-manage/member-tags',
        meta: {
          aliasName: 'Managetag',
          icon: 'pay-circle',
          title: 'd251b20e.3cc026',
          permissions: ['member.memberlmana.Managetag']
        },
        component: () => import('@/view/member/members/tags')
      },
      {
        name: 'memberLevel',
        path: 'member-benefit/member-level',
        meta: {
          aliasName: 'managecard',
          icon: 'pay-circle',
          title: '3ed22e5e.6c1583',
          permissions: ['member.card.managecard']
        },
        component: () => import('@/view/member/level')
      },
      {
        name: 'tagsManageCustomerTags',
        path: 'tags-manage/customer-tags',
        meta: {
          aliasName: 'customerTags',
          icon: 'pay-circle',
          title: '3ed22e5e.68c1b8',
          permissions: ['member.tagsmanage.customerTags']
        },
        component: () => import('@/views/members/customer_tags')
      },
      {
        name: 'tagsManageCrowdMarking',
        path: 'tags-manage/crowd-marking',
        meta: {
          aliasName: 'crowdMarking',
          icon: 'pay-circle',
          title: '3ed22e5e.d8c9e1',
          permissions: ['member.tagsmanage.crowdMarking']
        },
        component: () => import('@/views/members/crowd_marking'),
        children: [
          {
            path: 'editor',
            component: () => import('@/views/members/crowd_marking_editor')
          }
        ]
      },
      {
        name: 'paymentRecords',
        path: 'member-benefit/payment-records',
        meta: {
          aliasName: 'managecardorder',
          icon: 'pay-circle',
          title: '3ed22e5e.08b4d7',
          permissions: ['member.card.managecardorder']
        },
        component: () => import('@/view/member/membercard/list')
      },
      {
        name: 'pointRule',
        path: 'member-benefit/point-rule',
        meta: {
          aliasName: 'pointrule',
          icon: 'pay-circle',
          title: '3ed22e5e.09d011',
          permissions: ['member.card.pointrule']
        },
        component: () => import('@/view/member/point/index.vue')
      },
      {
        name: 'pointOverview',
        path: 'member-benefit/point-overview',
        meta: {
          aliasName: 'pointoverview',
          icon: 'pay-circle',
          title: '3ed22e5e.dd182d',
          permissions: ['member.card.pointoverview']
        },
        component: () => import('@/view/member/point/overview.vue')
      },
      {
        name: 'bulkSms',
        path: 'member-outreach/bulk-sms',
        meta: {
          aliasName: 'smssend',
          icon: 'pay-circle',
          title: '3ed22e5e.43e10b',
          permissions: ['member.membertouch.smssend']
        },
        component: () => import('@/views/members/member_list'),
        children: [
          {
            path: 'detail/:user_id?',
            component: () => import('@/view/member/members/detail')
          }
        ]
      },
      {
        name: 'arrivalNotice',
        path: 'member-outreach/arrival-notice',
        meta: {
          aliasName: 'arrivalnotice',
          icon: 'pay-circle',
          title: '3ed22e5e.46a6b2',
          permissions: ['member.membertouch.arrivalnotice']
        },
        component: () => import('@/view/goods/arrivalNotice')
      },
      {
        name: 'registrySetting',
        path: 'member-setting/registry-setting',
        meta: {
          aliasName: 'manageinfomation',
          icon: 'pay-circle',
          title: '3ed22e5e.78ed32',
          permissions: ['member.membersetting.manageinfomation']
        },
        component: () => import('@/view/member/register')
        // component: () => import('@/view/members/register_member')
      },
      {
        name: 'logoutSetting',
        path: 'member-setting/logout-setting',
        meta: {
          aliasName: 'closeAccount',
          icon: 'pay-circle',
          title: '3ed22e5e.e5bdf5',
          permissions: ['member.membersetting.closeAccount']
        },
        component: () => import('@/views/members/logout_member')
      },
      {
        name: 'trustLogin',
        path: 'member-setting/trust-login',
        meta: {
          aliasName: 'trustlogin',
          icon: 'pay-circle',
          title: '3ed22e5e.7c7579',
          permissions: ['member.membersetting.trustlogin']
        },
        component: () => import('@/view/member/trustlogin/list')
      },
      {
        name: 'memberWhitelist',
        path: 'member-whitelist',
        meta: {
          aliasName: 'whitelistlist',
          icon: 'pay-circle',
          title: '3ed22e5e.05a2d8',
          permissions: ['member.whitelistlist']
        },
        component: () => {
          if (VERSION_IN_PURCHASE()) {
            return import('@/view/member/whitelist/list.purchase')
          } else {
            return import('@/view/member/whitelist/list')
          }
        }
      },
      {
        name: 'memberWhitelistImport',
        path: 'member-whitelist-import',
        meta: {
          aliasName: 'whitelistuploade',
          icon: 'pay-circle',
          title: '3ed22e5e.eba44e',
          permissions: ['member.whitelistuploade']
        },
        component: () => import('@/view/member/whitelist/uploadeindex')
      },
      // {
      //   name: 'export',
      //   path: 'member/export',
      //   meta: {
      //     aliasName: 'member-export',
      //     icon: 'pay-circle',
      //     title: '会员导出',
      //     permissions: ['member.memberlmana.member-export']
      //   },
      //   component: () => import('@/'),
      // },

      // TODO: 补充会员路由
      {
        name: 'rights',
        path: 'add/rights',
        meta: {
          aliasName: 'member-add-rights',
          icon: 'pay-circle',
          title: '3ed22e5e.ba6956',
          permissions: ['member.memberlmana.member-add-rights']
        },
        component: () => import('@/view/member/members/rightsList')
      },
      {
        name: 'information',
        path: 'member/information',
        meta: {
          aliasName: 'member-list-view',
          icon: 'pay-circle',
          title: '3ed22e5e.9a8766',
          permissions: ['member.memberlmana.member-list-view']
        },
        component: () => import('@/view/member/register')
      },
      {
        name: 'distribution',
        path: 'coupon/distribution',
        meta: {
          aliasName: 'member-send-coupons',
          icon: 'pay-circle',
          title: '3ed22e5e.dfa362',
          permissions: ['member.memberlmana.member-send-coupons']
        },
        component: () => import('@/views/members/member_list'),
        children: [
          {
            path: 'detail',
            component: () => import('@/view/member/members/detail')
          }
        ]
      },
      {
        name: 'texting',
        path: 'mass/texting',
        meta: {
          aliasName: 'member-send-sms',
          icon: 'pay-circle',
          title: '3ed22e5e.43e10b',
          permissions: ['member.memberlmana.member-send-sms']
        },
        component: () => import('@/views/members/member_list')
      },
      {
        name: 'label',
        path: 'label',
        meta: {
          aliasName: 'member-tag',
          icon: 'pay-circle',
          title: '3ed22e5e.fedbca',
          permissions: ['member.memberlmana.member-tag']
        },
        component: () => import('@/view/mall/goods/physical/normalGoodsTagUpload')
      }
      // {
      //   name: 'modification',
      //   path: 'member-phone-number/modification',
      //   meta: {
      //     aliasName: 'member-modify-phone-number',
      //     icon: 'pay-circle',
      //     title: '会员手机号修改',
      //     permissions: ['member.memberlmana.member-modify-phone-number']
      //   },
      //   component: () => import('@/'),
      // },
    ]
  }
]

export default routes
