import { BasicLayout } from '@/layout/basic'
import SubLayout from '@/view/sublayout'
import { VERSION_IN_PURCHASE } from '@/utils'


const routes = [
    {
        component: BasicLayout,
        meta: {
            aliasName: 'member',
            icon: 'shopping-bag',
            keepAlive: true,
            title: '商户'
        },
        name: 'member',
        path: '/member',
        children: [
            {
                name: 'list',
                path: 'member/list',
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
            }, {
                name: 'update',
                path: 'batch/update',
                meta: {
                    aliasName: 'managecustomer',
                    icon: 'pay-circle',
                    title: '批量更新',
                    permissions: ['member.memberlmana.managecustomer']
                },
                component: () => import('@/view/member/members/uploade')
            }, {
                name: 'tags',
                path: 'member/tags',
                meta: {
                    aliasName: 'Managetag',
                    icon: 'pay-circle',
                    title: '会员标签',
                    permissions: ['member.memberlmana.Managetag']
                },
                component: () => import('@/view/member/members/tags')
            }, {
                name: 'level',
                path: 'membership/level',
                meta: {
                    aliasName: 'managecard',
                    icon: 'pay-circle',
                    title: '会员等级',
                    permissions: ['member.card.managecard']
                },
                component: () => import('@/view/member/level')
            }, {
                name: 'records',
                path: 'payment/records',
                meta: {
                    aliasName: 'managecardorder',
                    icon: 'pay-circle',
                    title: '付费记录',
                    permissions: ['member.card.managecardorder']
                },
                component: () => import('@/view/member/membercard/list')
            }, {
                name: 'rule',
                path: 'points/rule',
                meta: {
                    aliasName: 'pointrule',
                    icon: 'pay-circle',
                    title: '积分规则',
                    permissions: ['member.card.pointrule']
                },
                component: () => import('@/view/member/point/index.vue')
            }, {
                name: '',
                path: '',
                meta: {
                    aliasName: 'pointoverview',
                    icon: 'pay-circle',
                    title: '积分流水',
                    permissions: ['member.card.pointoverview']
                },
                component: () => import('@/view/member/point/overview.vue')
            }, {
                name: 'flow',
                path: 'integral/flow',
                meta: {
                    aliasName: 'smssend',
                    icon: 'pay-circle',
                    title: '群发短信',
                    permissions: ['member.membertouch.smssend']
                },
                component: () => import('@/view/member/members/list')
            }, {
                name: 'notice',
                path: 'arrival/notice',
                meta: {
                    aliasName: 'arrivalnotice',
                    icon: 'pay-circle',
                    title: '到货通知',
                    permissions: ['member.membertouch.arrivalnotice']
                },
                component: () => import('@/view/goods/arrivalNotice')
            }, {
                name: 'configuration',
                path: 'registration/configuration',
                meta: {
                    aliasName: 'manageinfomation',
                    icon: 'pay-circle',
                    title: '注册配置',
                    permissions: ['member.membersetting.manageinfomation']
                },
                component: () => import('@/view/member/register')
            },{
                name: 'configuration',
                path: 'cancel/configuration',
                meta: {
                    aliasName: 'closeAccount',
                    icon: 'pay-circle',
                    title: '注销配置',
                    permissions: ['member.membersetting.closeAccount']
                },
                component: () => import('@/view/member/logout')
            },{
                name: 'login',
                path: 'trust/login',
                meta: {
                    aliasName: 'trustlogin',
                    icon: 'pay-circle',
                    title: '信任登录',
                    permissions: ['member.membersetting.trustlogin']
                },
                component: () => import('@/view/member/trustlogin/list')
            },{
                name: 'whitelist',
                path: 'member/whitelist',
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
            },{
                name: 'import',
                path: 'whitelist/import',
                meta: {
                    aliasName: 'whitelistuploade',
                    icon: 'pay-circle',
                    title: '白名单导入',
                    permissions: ['member.whitelistuploade']
                },
                component: () => import('@/view/member/whitelist/uploadeindex')
            },{
                name: 'export',
                path: 'member/export',
                meta: {
                    aliasName: 'member-export',
                    icon: 'pay-circle',
                    title: '会员导出',
                    permissions: ['member.memberlmana.member-export']
                },
                component: () => import('@/'),
            },{
                name: 'rights',
                path: 'add/rights',
                meta: {
                    aliasName: 'member-add-rights',
                    icon: 'pay-circle',
                    title: '添加权益',
                    permissions: ['member.memberlmana.member-add-rights']
                },
                component: () => import('@/view/member/members/rightsList')
            },{
                name: 'information',
                path: 'member/information',
                meta: {
                    aliasName: 'member-list-view',
                    icon: 'pay-circle',
                    title: '会员信息查看',
                    permissions: ['member.memberlmana.member-list-view']
                },
                component: () => import('@/view/member/register')
            },{
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
            },{
                name: 'texting',
                path: 'mass/texting',
                meta: {
                    aliasName: 'member-send-sms',
                    icon: 'pay-circle',
                    title: '群发短信',
                    permissions: ['member.memberlmana.member-send-sms']
                },
                component: () => import('@/view/member/members/list')
            },{
                name: 'label',
                path: 'label',
                meta: {
                    aliasName: 'member-tag',
                    icon: 'pay-circle',
                    title: '打标签',
                    permissions: ['member.memberlmana.member-tag']
                },
                component: () => import('@/view/mall/goods/physical/normalGoodsTagUpload')
            },{
                name: 'modification',
                path: 'member-phone-number/modification',
                meta: {
                    aliasName: 'member-modify-phone-number',
                    icon: 'pay-circle',
                    title: '会员手机号修改',
                    permissions: ['member.memberlmana.member-modify-phone-number']
                },
                component: () => import('@/'),
            },
        ]
    }
]

export default routes