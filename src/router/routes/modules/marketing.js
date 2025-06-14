import { BasicLayout } from '@/layout/basic'
import SubLayout from '@/view/sublayout'

const routes = [
    {
        component: BasicLayout,
        meta: {
            aliasName: 'marketing',
            icon: 'shopping-bag',
            keepAlive: true,
            title: '商户'
        },
        name: 'marketing',
        path: '/marketing',
        children: [
            {
                name: 'management',
                path: 'coupon/management',
                meta: {
                    aliasName: 'membermarketing',
                    icon: 'pay-circle',
                    title: '券管理',
                    permissions: ['marketing.coupon.membermarketing']
                },
                component: () => import('@/view/member/cardticket/coupon'),
                children: [
                    {
                        path: 'editor',
                        component: () => import('@/view/member/cardticket/edit')
                    },
                    {
                        path: 'detail',
                        component: () => import('@/view/member/cardticket/detail')
                    }
                ]
            }, {
                name: 'management',
                path: 'coupon-package/management',
                meta: {
                    aliasName: 'couponspackage',
                    icon: 'pay-circle',
                    title: '券包管理',
                    permissions: ['marketing.coupon.couponspackage']
                },
                component: () => import('@/view/member/cardticket/couponspackage'),
                children: [
                    {
                        path: 'editor',
                        component: () => import('@/view/member/cardticket/couponspackage/editor')
                    },
                    {
                        path: 'detail',
                        component: () => import('@/view/member/cardticket/couponspackage/detail')
                    }
                ]
            }, {
                name: 'record',
                path: 'voucher-issuance/record',
                meta: {
                    aliasName: 'coupongive',
                    icon: 'pay-circle',
                    title: '发券记录',
                    permissions: ['marketing.coupon.coupongive']
                },
                component: () => import('@/view/member/coupon/giveLog'),
                children: [
                    {
                        path: 'detail/:id?',
                        component: () => import('@/view/member/coupon/giveErrorLog')
                    }
                ]
            }, {
                name: 'distribution',
                path: 'mass-coupon/distribution',
                meta: {
                    aliasName: 'couponsend',
                    icon: 'pay-circle',
                    title: '群发优惠券',
                    permissions: ['marketing.coupon.couponsend']
                },
                component: () => import('@/view/member/members/list'),
                children: [
                    {
                        path: 'detail',
                        component: () => import('@/view/member/members/detail')
                    }
                ]
            }, {
                name: 'discount',
                path: 'full/discount',
                meta: {
                    aliasName: 'marketingsfulldiscount',
                    icon: 'pay-circle',
                    title: '满折',
                    permissions: ['marketing.promotion.marketingsfulldiscount']
                },
                component: () => import('@/view/member/promotions/fulldiscount/list'),
                children: [
                    {
                        path: 'editor/:marketing_id?',
                        component: () => import('@/view/member/promotions/fulldiscount/add')
                    }
                ]
            }, {
                name: 'reduction',
                path: 'full/reduction',
                meta: {
                    aliasName: 'Marketingsfullminus',
                    icon: 'pay-circle',
                    title: '满减',
                    permissions: ['marketing.promotion.Marketingsfullminus']
                },
                component: () => import('@/view/member/promotions/fullminus/list'),
                children: [
                    {
                        path: 'editor/:marketing_id?',
                        component: () => import('@/view/member/promotions/fullminus/add')
                    }
                ]
            }, {
                name: 'gift',
                path: 'full/gift',
                meta: {
                    aliasName: 'Marketingsfullgift',
                    icon: 'pay-circle',
                    title: '满赠',
                    permissions: ['marketing.promotion.Marketingsfullgift']
                },
                component: () => import('@/view/member/promotions/fullgift/list'),
                children: [
                    {
                        path: 'editor/:marketing_id?',
                        component: () => import('@/view/member/promotions/fullgift/add')
                    }
                ]
            }, {
                name: 'specialOffer',
                path: 'limited-time/special-offer',
                meta: {
                    aliasName: 'limitedtimesale',
                    icon: 'pay-circle',
                    title: '限时特惠',
                    permissions: ['marketing.promotion.limitedtimesale']
                },
                component: () => import('@/view/member/promotions/limitedtimesale/list'),
                children: [
                    {
                        path: 'editor/:seckill_id?',
                        component: () => import('@/view/member/promotions/limitedtimesale/add')
                    }
                ]
            }, {
                name: 'purchase',
                path: 'increase/purchase',
                meta: {
                    aliasName: 'marketingspluspricebuy',
                    icon: 'pay-circle',
                    title: '加价购',
                    permissions: ['marketing.promotion.marketingspluspricebuy']
                },
                component: () => import('@/view/member/promotions/pluspricebuy/list'),
                children: [
                    {
                        path: 'editor/:marketing_id?',
                        component: () => import('@/view/member/promotions/pluspricebuy/add')
                    }
                ]
            }, {
                name: 'purchase',
                path: 'combination/purchase',
                meta: {
                    aliasName: 'marketingpackage',
                    icon: 'pay-circle',
                    title: '组合购',
                    permissions: ['marketing.promotion.marketingpackage']
                },
                component: () => import('@/view/member/promotions/package/list'),
                children: [
                    {
                        path: 'editor/:package_id?',
                        component: () => import('@/view/member/promotions/package/add')
                    }
                ]
            }, {
                name: 'marketing',
                path: 'new-customer/marketing',
                meta: {
                    aliasName: 'marketingindex',
                    icon: 'pay-circle',
                    title: '新客营销',
                    permissions: ['marketing.membermarket.marketingindex']
                },
                component: () => import('@/view/member/promotions/index')
            }, {
                name: 'marketing',
                path: 'targeted/marketing',
                meta: {
                    aliasName: 'SpecificCrowdDiscount',
                    icon: 'pay-circle',
                    title: '定向营销',
                    permissions: ['marketing.membermarket.SpecificCrowdDiscount']
                },
                component: () => import('@/view/member/promotions/specificcrowd/specificcrowddiscount'),
                children: [
                    {
                        path: 'detail/:id',
                        component: () => import('@/view/member/promotions/specificcrowd/userdiscoutlog')
                    }
                ]
            }, {
                name: 'purchase',
                path: 'priority/purchase',
                meta: {
                    aliasName: 'memberpreference',
                    icon: 'pay-circle',
                    title: '优先购',
                    permissions: ['marketing.membermarket.memberpreference']
                },
                component: () => import('@/view/member/promotions/memberpreference/list'),
                children: [
                    {
                        path: 'editor/:marketing_id?',
                        component: () => import('@/view/member/promotions/memberpreference/add')
                    }
                ]
            }, {
                name: 'automation',
                path: 'marketing/automation',
                meta: {
                    aliasName: 'marketingactivity',
                    icon: 'pay-circle',
                    title: '自动化营销',
                    permissions: ['marketing.membermarket.marketingactivity']
                },
                component: () => import('@/view/member/activity/index'),
                children: [
                    {
                        path: 'editor/:type?',
                        component: () => import('@/view/member/activity/add')
                    },
                    {
                        path: 'templ',
                        component: () => import('@/view/member/activity/templ')
                    }
                ]
            }, {
                name: 'recommendation',
                path: 'product/recommendation',
                meta: {
                    aliasName: 'recommendlike',
                    icon: 'pay-circle',
                    title: '商品推荐',
                    permissions: ['marketing.membermarket.recommendlike']
                },
                component: () => import('@/view/member/promotions/recommendlike')
            }, {
                name: 'buying',
                path: 'group/buying',
                meta: {
                    aliasName: 'groupsindex',
                    icon: 'pay-circle',
                    title: '拼团',
                    permissions: ['marketing.fissionmarketing.groupsindex']
                },
                component: () => import('@/view/member/groups/index'),
                children: [
                    {
                        path: 'editor/:groups_id?',
                        component: () => import('@/view/member/groups/add')
                    },
                    {
                        path: 'detail/:team_id?',
                        meta: {
                            title: `拼团-活动报名-活动报名-满赠管理-详情`
                        },
                        component: () => import('@/view/member/groups/teamDetail')
                    },
                    {
                        path: 'team/:groups_id?',
                        component: () => import('@/view/member/groups/team')
                    }
                ]
            }, {
                name: 'assistance',
                path: 'wx/assistance',
                meta: {
                    aliasName: 'marketingbargain',
                    icon: 'pay-circle',
                    title: '微信助力',
                    permissions: ['marketing.fissionmarketing.marketingbargain']
                },
                component: () => import('@/view/member/bargain/index'),
                children: [
                    {
                        path: 'editor/:bargain_id?',
                        component: () => import('@/view/member/bargain/add')
                    }
                ]
            }, {
                name: 'settings',
                path: 'basic/settings',
                meta: {
                    aliasName: 'popularizesetting',
                    icon: 'pay-circle',
                    title: '基础设置',
                    permissions: ['marketing.popularize.popularizesetting']
                },
                component: () => import('@/view/popularize/setting')
            }, {
                name: 'management',
                path: 'promotion-management',
                meta: {
                    aliasName: 'popularizelist',
                    icon: 'pay-circle',
                    title: '推广员管理',
                    permissions: ['marketing.popularize.popularizelist']
                },
                component: () => import('@/view/popularize/list'),
                children: [
                    {
                        path: 'detail',
                        component: () => import('@/view/popularize/brokerageLog')
                    },
                    {
                        path: 'child',
                        component: () => import('@/view/popularize/children')
                    }
                ]
            }, {
                name: 'management',
                path: 'level/management',
                meta: {
                    aliasName: 'promotersetting',
                    icon: 'pay-circle',
                    title: '等级管理',
                    permissions: ['marketing.popularize.promotersetting']
                },
                component: () => import('@/view/popularize/promoterSetting')
            }, {
                name: 'promoters',
                path: 'performance/promoters',
                meta: {
                    aliasName: 'popularizedata',
                    icon: 'pay-circle',
                    title: '推广员业绩',
                    permissions: ['marketing.popularize.popularizedata']
                },
                component: () => import('@/view/popularize/data'),
                children: [
                    {
                        path: 'detail',
                        component: () => import('@/view/popularize/brokerageLog')
                    }
                ]
            }, {
                name: 'application',
                path: 'withdrawal/application',
                meta: {
                    aliasName: 'popularizewithdraw',
                    icon: 'pay-circle',
                    title: '提现申请',
                    permissions: ['marketing.popularize.popularizewithdraw']
                },
                component: () => import('@/view/popularize/withdraw')
            }, {
                name: 'goods',
                path: 'distribution/goods',
                meta: {
                    aliasName: 'popularizegoods',
                    icon: 'pay-circle',
                    title: '分销商品',
                    permissions: ['marketing.popularize.popularizegoods']
                },
                component: () => import('@/view/popularize/goods')
            }, {
                name: 'details',
                path: 'task-commission/details',
                meta: {
                    aliasName: 'taskbrokerage',
                    icon: 'pay-circle',
                    title: '任务佣金明细',
                    permissions: ['marketing.popularize.taskbrokerage']
                },
                component: () => import('@/view/popularize/taskBrokerage')
            }, {
                name: 'statistics',
                path: 'task-commission/statistics',
                meta: {
                    aliasName: 'taskbrokeragecount',
                    icon: 'pay-circle',
                    title: '任务佣金统计',
                    permissions: ['marketing.popularize.taskbrokeragecount']
                },
                component: () => import('@/view/popularize/taskBrokerageCount')
            }, {
                name: 'streaming',
                path: 'program/streaming',
                meta: {
                    aliasName: 'liveroomlist',
                    icon: 'pay-circle',
                    title: '小程序直播',
                    permissions: ['marketing.liveroomlist']
                },
                component: () => import('@/view/mall/liveroom/list'),
                children: [
                    {
                        path: 'editor/:itemId?',
                        meta: {
                            title: `小程序直播-活动报名-活动报名-直播-编辑`
                        },
                        component: () =>
                            import(
              /* webpackChunkName: "marketing-liveroomlist-editor" */ '@/view/mall/liveroom/replay'
                            )
                    }
                ]
            }, {
                name: 'activities',
                path: 'all/activities',
                meta: {
                    aliasName: 'Registrationactivity',
                    icon: 'pay-circle',
                    title: '全部活动',
                    permissions: ['marketing.apply.Registrationactivity']
                },
                component: () => import('@/view/member/selfservice/registrationactivity'),
                children: [
                    {
                        path: 'editor',
                        component: () => import('@/view/member/selfservice/registrationactivityadd')
                    }
                ]
            }, {
                name: 'record',
                path: 'registration/record',
                meta: {
                    aliasName: 'Registrationrecord',
                    icon: 'pay-circle',
                    title: '报名记录',
                    permissions: ['marketing.apply.Registrationrecord']
                },
                component: () => import('@/view/member/selfservice/registrationrecord'),
                children: [
                    {
                        path: 'detail',
                        component: () => import('@/view/member/selfservice/registrationrecordetail')
                    },
                    {
                        path: 'editor',
                        component: () => import('@/view/member/selfservice/regRecordUpload')
                    }
                ]
            }, {
                name: 'element',
                path: 'form/element',
                meta: {
                    aliasName: 'formattrs',
                    icon: 'pay-circle',
                    title: '表单元素',
                    permissions: ['marketing.apply.formattrs']
                },
                component: () => import('@/view/member/selfservice/formsettinglist'),
                children: [
                  {
                    path: 'editor/:itemId?',
                    name: `表单元素配置-编辑`,
                    component: () => import('@/view/member/selfservice/formsettingadd')
                  }
                ]
            }, {
                name: 'template',
                path: 'form/template',
                meta: {
                    aliasName: 'formtemplate',
                    icon: 'pay-circle',
                    title: '表单模板',
                    permissions: ['marketing.apply.formtemplate']
                },
                component: () => import('@/view/member/selfservice/formtemplatelist'),
                children: [
                  {
                    path: 'editor/:itemId?',
                    name: `表单模板配置-编辑`,
                    component: () => import('@/view/member/selfservice/formtemplateadd')
                  }
                ]
            }, {
                name: 'wheel',
                path: 'big/wheel',
                meta: {
                    aliasName: 'wheel',
                    icon: 'pay-circle',
                    title: '大转盘',
                    permissions: ['marketing.wheel']
                },
                component: () => import('@/view/member/promotions/wheel/index')
            }
        ]
    }
]

export default routes