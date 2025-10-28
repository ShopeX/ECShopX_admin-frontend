// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

import { BasicLayout } from '@/layout/basic'
import { VERSION_IN_PURCHASE } from '@/utils'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'member',
      icon: 'light-member',
      keepAlive: true,
      title: '会员'
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
          title: '会员列表',
          permissions: ['member.memberlmana.memberlist']
        },
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
        name: 'batchUpdate',
        path: 'member-manage/batch-update',
        meta: {
          aliasName: 'managecustomer',
          icon: 'pay-circle',
          title: '批量更新',
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
          title: '会员标签',
          permissions: ['member.memberlmana.Managetag']
        },
        component: () => import('@/view/member/members/tags')
      },
      // TODO: 补充会员路由
      {
        name: 'memberLevel',
        path: 'member-benefit/member-level',
        meta: {
          aliasName: 'managecard',
          icon: 'pay-circle',
          title: '会员等级',
          permissions: ['member.card.managecard']
        },
        component: () => import('@/view/member/level')
      },
      {
        name: 'paymentRecords',
        path: 'member-benefit/payment-records',
        meta: {
          aliasName: 'managecardorder',
          icon: 'pay-circle',
          title: '付费记录',
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
          title: '积分规则',
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
          title: '积分流水',
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
          title: '群发短信',
          permissions: ['member.membertouch.smssend']
        },
        component: () => import('@/view/member/members/list'),
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
          title: '到货通知',
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
          title: '注册配置',
          permissions: ['member.membersetting.manageinfomation']
        },
        component: () => import('@/view/member/register')
        // component: () => import('@/view/members/register-member')
      },
      {
        name: 'logoutSetting',
        path: 'member-setting/logout-setting',
        meta: {
          aliasName: 'closeAccount',
          icon: 'pay-circle',
          title: '注销配置',
          permissions: ['member.membersetting.closeAccount']
        },
        component: () => import('@/views/members/logout-member')
      },
      {
        name: 'trustLogin',
        path: 'member-setting/trust-login',
        meta: {
          aliasName: 'trustlogin',
          icon: 'pay-circle',
          title: '信任登录',
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
          title: '会员白名单',
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
          title: '白名单导入',
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
          title: '添加权益',
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
          title: '会员信息查看',
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
          title: '群发优惠券',
          permissions: ['member.memberlmana.member-send-coupons']
        },
        component: () => import('@/view/member/members/list'),
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
          title: '群发短信',
          permissions: ['member.memberlmana.member-send-sms']
        },
        component: () => import('@/view/member/members/list')
      },
      {
        name: 'label',
        path: 'label',
        meta: {
          aliasName: 'member-tag',
          icon: 'pay-circle',
          title: '打标签',
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
