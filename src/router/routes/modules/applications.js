import { BasicLayout } from '@/layout/basic'
import SubLayout from '@/view/sublayout'

const routes = [
    {
        component: BasicLayout,
        meta: {
            aliasName: 'applications',
            icon: 'shopping-bag',
            keepAlive: true,
            title: '应用'
        },
        name: 'applications',
        path: '/applications',
        children: [
            {
                name: 'approval',
                path: 'user/approval',
                meta: {
                    aliasName: 'userAudit',
                    title: '用户进件审批',
                    icon: 'pay-circle',
                    permissions: ['applications.bspay.user_audit'],
                },
                component: () => import('@/view/mall/marketing/huifuBspay'),
                children: [
                    {
                        path: 'approve/:id?',
                        component: () => import('@/view/mall/marketing/huifuBspay/approve'),
                    }
                ],
            },
            {
                name: 'subAccount',
                path: 'trades',
                component: () => import('@/view/mall/bspay_sub_account/sub_account'),
                meta: {
                    aliasName: 'bspayTrades',
                    icon: 'pay-circle',
                    title: '分账明细',
                    permissions: ['applications.bspay.bspay_trades']
                },
                children: [
                    {
                        path: 'detail/:order_id',
                        component: () => import('@/view/mall/bspay_sub_account/detail'),
                        // meta: {
                        //     title: '分账明细详情',
                        //     hidden: true
                        // }
                    }
                ]
            },
            {
                name: 'management',
                path: 'event/management',
                meta: {
                    aliasName: 'purchaseAdmin',
                    icon: 'pay-circle',
                    title: '活动管理',
                    permissions: ['applications.ec.purchase-admin']
                },
                component: () => import('@/view/sublayout'),
                children: [
                    {
                        path: '/',
                        component: () => import('@/view/marketing/employee/list')
                    },
                    {
                        path: 'create/:id?',
                        component: () => import('@/view/marketing/employee/purchase')
                    },
                    {
                        path: 'result/:id',
                        component: () => import('@/view/marketing/employee/result')
                    },
                    {
                        path: 'goods/:id',
                        component: () => import('@/view/marketing/employee/addGoods')
                    },
                    {
                        path: 'dependents/:id',
                        component: () => import('@/view/marketing/employee/dependents')
                    }
                ]
            },
            {
                name: 'management',
                path: 'staff/management',
                meta: {
                    aliasName: 'employeeAdmin',
                    icon: 'pay-circle',
                    title: '员工管理',
                    permissions: ['applications.ec.employee-admin']
                },
                component: () => import('@/view/member/purchase/employee'),
                children: [
                    {
                        path: 'import',
                        component: () => import('@/view/member/purchase/employeeImport')
                    },
                ]
            },
            {
                name: 'management',
                path: 'enterprise/management',
                meta: {
                    aliasName: 'company-admin',
                    icon: 'pay-circle',
                    title: '企业管理',
                    permissions: ['applications.ec.company-admin']
                },
                component: () => import('@/view/member/purchase/company')
            },
            {
                name: 'order',
                path: 'internal-purchase/order',
                meta: {
                    aliasName: 'purchase-list',
                    icon: 'pay-circle',
                    title: '内购订单',
                    permissions: ['applications.ec.purchase-list']
                },
                component: () => import('@/view/order/entitytrade/purchase'),
                children: [
                    {
                        path: 'detail/:itemId?',
                        component: () => import('@/view/mall/trade/order/detail'),
                        meta: {
                            footerFixed: true
                        }
                    },
                    {
                        path: 'process/:itemId?',
                        component: () => import('@/view/mall/trade/order/process')
                    },
                    {
                        path: 'after-sale/:id?',
                        component: () => import('@/view/mall/trade/order/afterSale')
                    },
                    {
                        path: 'logistics/:itemId?',
                        component: () => import('@/view/mall/trade/order/logistics')
                    }
                ]
            },
            {
                name: 'settings',
                path: 'enterprise-weChat/settings',
                meta: {
                    aliasName: 'workwechat',
                    icon: 'pay-circle',
                    title: '企业微信设置',
                    permissions: ['applications.guide.workwechat']
                },
                component: () => import('@/view/base/setting/workwechat/workwechat')
            },
            {
                name: 'homepages',
                path: 'shopping-guide/homepages',
                meta: {
                    aliasName: 'salespersonshelfindex',
                    icon: 'pay-circle',
                    title: '导购货架首页',
                    permissions: ['applications.guide.salespersonshelfindex']
                },
                component: () => import('@/view/wxapp/salespersonshelfindex')
            },
            {
                name: 'management',
                path: 'event/management',
                meta: {
                    aliasName: 'activity',
                    icon: 'pay-circle',
                    title: '活动管理',
                    permissions: ['applications.community.activity']
                },
                component: () => import('@/view/member/promotions/community/activity/index'),
                children: [
                    {
                        path: 'editor/:activity_id?',
                        component: () => import('@/view/member/promotions/community/activity/add')
                    }
                ]
            },
            {
                name: 'products',
                path: 'activity/products',
                meta: {
                    aliasName: 'communitygoods',
                    icon: 'pay-circle',
                    title: '活动商品',
                    permissions: ['applications.community.communitygoods']
                },
                component: () => import('@/view/mall/community/communitygoods')
            }, {
                name: 'orders',
                path: 'activity/orders',
                meta: {
                    aliasName: 'communityorder',
                    icon: 'pay-circle',
                    title: '活动订单',
                    permissions: ['applications.community.communityorder']
                },
                component: () => import('@/view/mall/trade/normalorders/communityList'),
                children: [
                    {
                        path: 'detail/:itemId?',
                        component: () => import('@/view/mall/trade/order/detail')
                    },
                    {
                        path: 'process/:itemId?',
                        component: () => import('@/view/mall/trade/order/process')
                    }
                ]
            }, {
                name: 'configuration',
                path: 'active/configuration',
                meta: {
                    aliasName: 'communitysetting',
                    icon: 'pay-circle',
                    title: '活动配置',
                    permissions: ['applications.community.communitysetting']
                },
                component: () => import('@/view/member/promotions/community/setting')
            }, {
                name: 'management',
                path: 'community/management',
                meta: {
                    aliasName: 'subdistrict',
                    icon: 'pay-circle',
                    title: "社区管理",
                    permissions: ['applications.community.subdistrict']
                },
                component: () => import('@/view/mall/subdistrict/list')
            }, {
                name: 'management',
                path: 'team-leader/management',
                meta: {
                    aliasName: 'communitychief',
                    icon: 'pay-circle',
                    title: '团长管理',
                    permissions: ['applications.community.communitychief']
                },
                component: () => import('@/view/mall/community/chief'),
                children: [
                    {
                      path: 'detail/:apply_id',
                      component: () => import('@/view/mall/community/chiefDetail')
                    },
                    {
                      path: 'info/:apply_id/:distributor_id',
                      component: () => import('@/view/mall/community/chiefInfo')
                    },
                    {
                      path: 'approve',
                      component: () => import('@/view/mall/community/chiefApprove')
                    }
                  ]
            }, {
                name: 'performance',
                path: 'team-leader/performance',
                meta: {
                    aliasName: 'achievement',
                    icon: 'pay-circle',
                    title: '团长业绩',
                    permissions: ['applications.community.achievement']
                },
                component: () => import('@/view/mall/community/achievement')
            }, {
                name: 'application',
                path: 'withdrawal/application',
                meta: {
                    aliasName: 'withdraw',
                    icon: 'pay-circle',
                    title: '提现申请',
                    permissions: ['applications.community.withdraw']
                },
                component: () => import('@/view/mall/community/withdraw')
            },
            {
                name: 'import',
                path: 'leader/import',
                meta: {
                    aliasName: 'chiefupload1',
                    icon: 'pay-circle',
                    title: '团长导入',
                    permissions: ['applications.community.chiefupload1']
                },
                component: () => import('@/view/member/members/upload_chief')
            },
            // {
            //     name: 'management',
            //     path: 'live-streaming/management',
            //     meta: {
            //         aliasName: 'live',
            //         icon: 'pay-circle',
            //         title: '直播管理',
            //         permissions: ['applications.polyv.live']
            //     },
            //     component: () => import('@/view/live/liveRoom/index.vue'),
            //     children: [
            //         {
            //           path: 'detail/:id?',
            //           component: () => import('@/view/live/liveRoom/detail/index.vue')
            //         }
            //       ]            
            // },{
            //     name: 'management',
            //     path: 'account/management',
            //     meta: {
            //         aliasName: 'anchorManagement',
            //         icon: 'pay-circle',
            //         title: '账号管理',
            //         permissions: ['applications.polyv.anchorManagement']
            //     },
            //     component: () => import('@/view/live/anchor/index.vue'),
            //     children: [
            //         {
            //           path: 'upload',
            //           component: () => import('@/view/live/anchor/upload/index.vue')
            //         }
            //       ]
            
            // },
            {
                name: 'extensions',
                path: 'extensions',
                meta: {
                    aliasName: 'extapp',
                    icon: 'pay-circle',
                    title: '扩展应用',
                    permissions: ['applications.appsgroup.extapp']
                },
                component: () => import('@/view/applications/plugin'),
                children: [
                    {
                      path: 'detail/:id?',
                      component: () => import('@/view/applications/plugin/appDetail.vue')
                    }
                  ]
            },
            {
                name: 'management',
                path: 'commodity/management',
                meta: {
                    aliasName: 'jfgoods',
                    icon: 'pay-circle',
                    title: '商品管理',
                    permissions: ['applications.jfmall.jfgoods']
                },
                component: () => import('@/view/applications/pointmall/list'),
                children: [
                    {
                      path: 'editor/:itemId?',
                      component: () => import('@/view/applications/pointmall/add')
                    },
                    {
                      path: 'physicalupload',
                      name: `实体商品导入`,
                      component: () => import('@/view/applications/pointmall/goodsImport')
                    },
                    {
                      path: 'physicalstoreupload',
                      name: `商品库存导入`,
                      component: () => import('@/view/applications/pointmall/storeImport')
                    }
                  ]
            },
            {
                name: 'management',
                path: 'order/management',
                meta: {
                    aliasName: 'jforders',
                    icon: 'pay-circle',
                    title: '订单管理',
                    permissions: ['applications.jfmall.jforders']
                },
                component: () => import('@/view/applications/pointmall/orderList'),
                children: [
                    {
                      path: 'detail/:itemId?',
                      component: () => import('@/view/applications/pointmall/orderDetail')
                    }
                  ]
            },
            {
                name: 'settings',
                path: 'basic/settings',
                meta: {
                    aliasName: 'jfsettin',
                    icon: 'pay-circle',
                    title: '基础设置',
                    permissions: ['applications.jfmall.jfsetting']
                },
                component: () => import('@/view/applications/pointmall/setting')
            },
            {
                name: 'details',
                path: 'separate-account/details',
                meta: {
                    aliasName: 'adapay_trades',
                    icon: 'pay-circle',
                    title: '分账明细',
                    permissions: ['applications.adapay.adapay_trades']
                },
                component: () => import('@/view/mall/sub_account/sub_account'),
                children: [
                  {
                    path: 'detail/:order_id',
                    component: () => import('@/view/mall/sub_account/detail')
                  }
                ]
            },
            {
                name: 'withdrawal',
                path: 'withdrawal',
                meta: {
                    aliasName: 'adapay_cash',
                    icon: 'pay-circle',
                    title: '提现',
                    permissions: ['applications.adapay.adapay_cash']
                },
                component: () => import('@/view/mall/withdraw/withdraw')
            },
            {
                name: 'settings',
                path: 'withdrawal/settings',
                meta: {
                    aliasName: 'adapay_cash_setting',
                    icon: 'pay-circle',
                    title: '提现设置',
                    permissions: ['applications.adapay.adapay_cash_setting']
                },
                component: () => import('@/view/mall/withdraw/withdraw_setting.vue')
            },
            {
                name: 'approval',
                path: 'account-opening/approval',
                meta: {
                    aliasName: 'adapay_member_audit',
                    icon: 'pay-circle',
                    title: '开户审批',
                    permissions: ['applications.adapay.adapay_member_audit']
                },
                component: () => import('@/view/mall/marketing/openingapproval'),
                children: [
                    {
                    path: 'approve/:id?',
                    component: () => import('@/view/mall/marketing/openingapproval/approve')
                    }
                ]
            },
        ]
    }
]

export default routes