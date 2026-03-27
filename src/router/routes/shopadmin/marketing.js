/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架
import SubLayout from '@/view/sublayout'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'marketing',
      icon: 'sales-report',
      keepAlive: true,
      title: 'f58886c3.916801'
    },
    name: 'shopadminMarketing',
    path: '/shopadmin/marketing',
    children: [
      {
        name: 'memberMarketing',
        path: 'coupon/membermarketing',
        component: () => import('@/view/member/cardticket/coupon'),
        meta: {
          aliasName: 'membermarketing',
          icon: 'icon-coupon',
          title: 'f58886c3.e3440a',
          permissions: ['marketing.coupon.membermarketing']
        },
        children: [
          {
            path: 'editor',
            component: () => import('@/view/member/cardticket/edit'),
            meta: {
              title: 'f58886c3.87b8c5',
              hidden: true
            }
          },
          {
            path: 'detail',
            component: () => import('@/view/member/cardticket/detail'),
            meta: {
              title: 'f58886c3.cb7034',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'couponGive',
        path: 'coupon/coupongive',
        component: () => import('@/view/member/coupon/giveLog'),
        meta: {
          aliasName: 'coupongive',
          icon: 'icon-give',
          title: 'f58886c3.725e84',
          permissions: ['marketing.coupon.coupongive']
        },
        children: [
          {
            path: 'detail/:id',
            component: () => import('@/view/member/coupon/giveErrorLog'),
            meta: {
              title: 'f58886c3.0901bf',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'increasePurchase',
        path: 'promotion/increase-purchase',
        component: () => import('@/view/member/promotions/pluspricebuy/list'),
        meta: {
          aliasName: 'marketingspluspricebuy',
          icon: 'icon-plus',
          title: 'f58886c3.54e654',
          permissions: ['marketing.marketingspluspricebuy']
        },
        children: [
          {
            path: 'editor/:marketing_id?',
            component: () => import('@/view/member/promotions/pluspricebuy/add'),
            meta: {
              title: 'f58886c3.26b2e2',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'combinationPurchase',
        path: 'promotion/combination-purchase',
        component: () => import('@/view/member/promotions/package/list'),
        meta: {
          aliasName: 'marketingpackage',
          icon: 'icon-package',
          title: 'f58886c3.3e9a00',
          permissions: ['marketing.marketingpackage']
        },
        children: [
          {
            path: 'editor/:package_id?',
            component: () => import('@/view/member/promotions/package/add')
          }
        ]
      },
      {
        name: 'limitedTime',
        path: 'promotion/limited-time',
        component: () => import('@/view/member/promotions/limitedtimesale/list'),
        meta: {
          aliasName: 'limitedtimesale',
          icon: 'icon-time',
          title: 'f58886c3.a0aaca',
          permissions: ['marketing.limitedtimesale']
        },
        children: [
          {
            path: 'editor/:seckill_id?',
            component: () => import('@/view/member/promotions/limitedtimesale/add'),
            meta: {
              title: 'f58886c3.cccaa4',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'promotionGoodsLimit',
        path: 'promotion/goods-limit',
        component: () => import('@/view/member/promotions/goodslimit/list'),
        meta: {
          aliasName: 'goodslimit',
          icon: 'icon-limit',
          title: 'f58886c3.44d46e',
          permissions: ['marketing.goodslimit']
        },
        children: [
          {
            path: 'editor/:limit_id?',
            component: () => import('@/view/member/promotions/goodslimit/add'),
            meta: {
              title: 'f58886c3.203870',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'fullDiscount',
        path: 'promotion/full-discount',
        component: () => import('@/view/member/promotions/fulldiscount/list'),
        meta: {
          aliasName: 'marketingsfulldiscount',
          icon: 'icon-discount',
          title: 'f58886c3.1c120b',
          permissions: ['marketing.marketingsfulldiscount']
        },
        children: [
          {
            path: 'editor/:marketing_id?',
            component: () => import('@/view/member/promotions/fulldiscount/add')
          }
        ]
      },
      {
        name: 'promotionFullReduction',
        path: 'promotion/full-reduction',
        component: () => import('@/view/member/promotions/fullminus/list'),
        meta: {
          aliasName: 'marketingsfullminus',
          icon: 'icon-minus',
          title: 'f58886c3.94b1fd',
          permissions: ['marketing.marketingsfullminus']
        },
        children: [
          {
            path: 'editor/:marketing_id?',
            component: () => import('@/view/member/promotions/fullminus/add'),
            meta: {
              title: 'f58886c3.a39453',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'promotionFullGift',
        path: 'promotion/full-gift',
        component: () => import('@/view/member/promotions/fullgift/list'),
        meta: {
          aliasName: 'marketingsfullgift',
          icon: 'icon-gift',
          title: 'f58886c3.1a4f21',
          permissions: ['marketing.marketingsfullgift']
        },
        children: [
          {
            path: 'editor/:marketing_id?',
            component: () => import('@/view/member/promotions/fullgift/add'),
            meta: {
              title: 'f58886c3.595788',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'marketingSeckill',
        path: 'marketingseckill',
        component: () => import('@/view/member/promotions/seckill/list'),
        meta: {
          aliasName: 'marketingseckill',
          icon: 'icon-seckill',
          title: 'f58886c3.92325c',
          permissions: ['shopadmin.marketing.marketingseckill']
        },
        children: [
          {
            path: 'editor/:seckill_id?',
            component: () => import('@/view/member/promotions/seckill/add'),
            meta: {
              title: 'f58886c3.7a075e',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'communityChiefManage',
        path: 'community/chief-manage',
        component: () => import('@/view/mall/community/chief'),
        meta: {
          aliasName: 'communitychief',
          icon: 'icon-chief',
          title: 'f58886c3.0303d0',
          permissions: ['marketing.community.communitychief']
        },
        children: [
          {
            path: 'detail/:apply_id',
            component: () => import('@/view/mall/community/chiefDetail'),
            meta: {
              title: 'f58886c3.782c47',
              hidden: true
            }
          },
          {
            path: 'approve',
            component: () => import('@/view/mall/community/chiefApprove'),
            meta: {
              title: 'f58886c3.e6c6bd',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'communityActivityManage',
        path: 'community/activity-manage',
        component: () => import('@/view/mall/community/activityList'),
        meta: {
          aliasName: 'communityactivity',
          icon: 'icon-activity',
          title: 'f58886c3.d285a2',
          permissions: ['marketing.community.communityactivity']
        }
      },
      {
        name: 'communityOrderManage',
        path: 'community/order-manage',
        component: () => import('@/view/mall/trade/normalorders/communityList'),
        meta: {
          aliasName: 'communityorder',
          icon: 'icon-order',
          title: 'f58886c3.afcd11',
          permissions: ['marketing.community.communityorder']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/trade/order/detail'),
            meta: {
              title: 'f58886c3.8054f7',
              hidden: true
            }
          },
          {
            path: 'process/:itemId?',
            component: () => import('@/view/mall/trade/order/process'),
            meta: {
              title: 'f58886c3.afbe0f',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'communityActivityGoods',
        path: 'community/activity-goods',
        component: () => import('@/view/mall/community/communitygoods'),
        meta: {
          aliasName: 'communitygoods',
          icon: 'icon-goods',
          title: 'f58886c3.42f9f7',
          permissions: ['marketing.community.communitygoods']
        }
      },

      {
        name: 'communityActivitySetting',
        path: 'community/activity-setting',
        component: () => import('@/view/mall/community/setting'),
        meta: {
          aliasName: 'communitysetting',
          icon: 'icon-setting',
          title: 'f58886c3.b24f85',
          permissions: ['marketing.community.communitysetting']
        }
      },
      {
        name: 'communityChiefAchievement',
        path: 'community/chief-achievement',
        component: () => import('@/view/mall/community/achievement'),
        meta: {
          aliasName: 'communityachievement',
          icon: 'icon-achievement',
          title: 'f58886c3.09cfa9',
          permissions: ['marketing.community.achievement']
        }
      },
      {
        name: 'communityWithdrawApply',
        path: 'community/withdraw-apply',
        component: () => import('@/view/mall/community/withdraw'),
        meta: {
          aliasName: 'withdraw',
          icon: 'icon-withdraw',
          title: 'f58886c3.33011e',
          permissions: ['marketing.community.withdraw']
        }
      },
      {
        name: 'employeePurchase',
        path: 'employee/purchase',
        component: SubLayout,
        meta: {
          aliasName: 'employeepurchase',
          icon: 'icon-employee',
          title: 'f58886c3.d0465c',
          permissions: ['shopadmin.marketing.employee.purchase']
        },
        children: [
          {
            path: '/',
            component: () => import('@/view/marketing/employee/list'),
            meta: {
              title: 'f58886c3.bf673c',
              hidden: true
            }
          },
          {
            path: 'create/:id?',
            component: () => import('@/view/marketing/employee/purchase'),
            meta: {
              title: 'f58886c3.f652be',
              hidden: true
            }
          },
          {
            path: 'result/:id',
            component: () => import('@/view/marketing/employee/result'),
            meta: {
              title: 'f58886c3.63ecba',
              hidden: true
            }
          },
          {
            path: 'goods/:id',
            component: () => import('@/view/marketing/employee/addGoods'),
            meta: {
              title: 'f58886c3.fa3aee',
              hidden: true
            }
          },
          {
            path: 'dependents/:id',
            component: () => import('@/view/marketing/employee/dependents'),
            meta: {
              title: 'f58886c3.b08ef3',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'purchase',
        path: 'purchase',
        component: () => import('@/view/member/promotions/purchase/index'),
        meta: {
          aliasName: 'purchase',
          icon: 'icon-purchase',
          title: 'f58886c3.6e5918',
          permissions: ['shopadmin.marketing.purchase']
        },
        children: [
          {
            path: 'editor',
            component: () => import('@/view/member/promotions/purchase/editor'),
            meta: {
              title: 'f58886c3.e90d30',
              hidden: true
            }
          },
          {
            path: 'detail',
            component: () => import('@/view/member/promotions/purchase/detail'),
            meta: {
              title: 'f58886c3.62c605',
              hidden: true
            }
          },
          {
            path: 'dependents',
            component: () => import('@/view/member/promotions/purchase/dependents'),
            meta: {
              title: 'f58886c3.b08ef3',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'registrationActivity',
        path: 'apply/registrationactivity',
        component: () => import('@/view/member/selfservice/registrationactivity'),
        meta: {
          aliasName: 'registrationactivity',
          icon: 'icon-registration',
          title: 'f58886c3.5e06be',
          permissions: ['shopadmin.marketing.apply.registrationactivity']
        },
        children: [
          {
            path: 'editor',
            component: () => import('@/view/member/selfservice/registrationactivityadd'),
            meta: {
              title: 'f58886c3.9bd915',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'activityApplyActivityRecord',
        path: 'activity-apply/activity-record',
        component: () => import('@/view/member/selfservice/registrationrecord'),
        meta: {
          aliasName: 'registrationrecord',
          icon: 'icon-record',
          title: 'f58886c3.42a5b5',
          permissions: ['shopadmin.marketing.apply.registrationrecord']
        },
        children: [
          {
            path: 'detail',
            component: () => import('@/view/member/selfservice/registrationrecordetail'),
            meta: {
              title: 'f58886c3.7424a4',
              hidden: true
            }
          },
          {
            path: 'editor',
            component: () => import('@/view/member/selfservice/regRecordUpload'),
            meta: {
              title: 'f58886c3.f880b2',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
