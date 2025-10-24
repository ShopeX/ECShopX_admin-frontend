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

// 营销路由
import { BasicLayout } from '@/layout/basic' // 主框架
import SubLayout from '@/view/sublayout'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'marketing',
      icon: 'sales-report',
      keepAlive: true,
      title: '营销'
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
          title: '优惠券管理',
          permissions: ['marketing.coupon.membermarketing']
        },
        children: [
          {
            path: 'editor',
            component: () => import('@/view/member/cardticket/edit'),
            meta: {
              title: '编辑优惠券',
              hidden: true
            }
          },
          {
            path: 'detail',
            component: () => import('@/view/member/cardticket/detail'),
            meta: {
              title: '优惠券详情',
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
          title: '发券记录',
          permissions: ['marketing.coupon.coupongive']
        },
        children: [
          {
            path: 'detail/:id',
            component: () => import('@/view/member/coupon/giveErrorLog'),
            meta: {
              title: '发放错误日志',
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
          title: '加价购',
          permissions: ['marketing.marketingspluspricebuy']
        },
        children: [
          {
            path: 'editor/:marketing_id?',
            component: () => import('@/view/member/promotions/pluspricebuy/add'),
            meta: {
              title: '编辑加价购',
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
          title: '组合购',
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
          title: '限时特惠',
          permissions: ['marketing.limitedtimesale']
        },
        children: [
          {
            path: 'editor/:seckill_id?',
            component: () => import('@/view/member/promotions/limitedtimesale/add'),
            meta: {
              title: '编辑限时特惠',
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
          title: '商品限购',
          permissions: ['marketing.goodslimit']
        },
        children: [
          {
            path: 'editor/:limit_id?',
            component: () => import('@/view/member/promotions/goodslimit/add'),
            meta: {
              title: '编辑商品限购',
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
          title: '满折',
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
          title: '满减',
          permissions: ['marketing.marketingsfullminus']
        },
        children: [
          {
            path: 'editor/:marketing_id?',
            component: () => import('@/view/member/promotions/fullminus/add'),
            meta: {
              title: '编辑满减',
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
          title: '满赠管理',
          permissions: ['marketing.marketingsfullgift']
        },
        children: [
          {
            path: 'editor/:marketing_id?',
            component: () => import('@/view/member/promotions/fullgift/add'),
            meta: {
              title: '编辑满赠',
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
          title: '限时秒杀',
          permissions: ['shopadmin.marketing.marketingseckill']
        },
        children: [
          {
            path: 'editor/:seckill_id?',
            component: () => import('@/view/member/promotions/seckill/add'),
            meta: {
              title: '编辑秒杀',
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
          title: '团长管理',
          permissions: ['marketing.community.communitychief']
        },
        children: [
          {
            path: 'detail/:apply_id',
            component: () => import('@/view/mall/community/chiefDetail'),
            meta: {
              title: '团长详情',
              hidden: true
            }
          },
          {
            path: 'approve',
            component: () => import('@/view/mall/community/chiefApprove'),
            meta: {
              title: '团长审核',
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
          title: '活动管理',
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
          title: '订单管理',
          permissions: ['marketing.community.communityorder']
        },
        children: [
          {
            path: 'detail/:itemId?',
            component: () => import('@/view/mall/trade/order/detail'),
            meta: {
              title: '订单详情',
              hidden: true
            }
          },
          {
            path: 'process/:itemId?',
            component: () => import('@/view/mall/trade/order/process'),
            meta: {
              title: '订单处理',
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
          title: '活动商品',
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
          title: '活动配置',
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
          title: '团长业绩',
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
          title: '提现申请',
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
          title: '内购',
          permissions: ['shopadmin.marketing.employee.purchase']
        },
        children: [
          {
            path: '/',
            component: () => import('@/view/marketing/employee/list'),
            meta: {
              title: '内购列表',
              hidden: true
            }
          },
          {
            path: 'create/:id?',
            component: () => import('@/view/marketing/employee/purchase'),
            meta: {
              title: '创建内购',
              hidden: true
            }
          },
          {
            path: 'result/:id',
            component: () => import('@/view/marketing/employee/result'),
            meta: {
              title: '内购结果',
              hidden: true
            }
          },
          {
            path: 'goods/:id',
            component: () => import('@/view/marketing/employee/addGoods'),
            meta: {
              title: '添加商品',
              hidden: true
            }
          },
          {
            path: 'dependents/:id',
            component: () => import('@/view/marketing/employee/dependents'),
            meta: {
              title: '家属管理',
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
          title: '员工内购',
          permissions: ['shopadmin.marketing.purchase']
        },
        children: [
          {
            path: 'editor',
            component: () => import('@/view/member/promotions/purchase/editor'),
            meta: {
              title: '编辑内购',
              hidden: true
            }
          },
          {
            path: 'detail',
            component: () => import('@/view/member/promotions/purchase/detail'),
            meta: {
              title: '内购详情',
              hidden: true
            }
          },
          {
            path: 'dependents',
            component: () => import('@/view/member/promotions/purchase/dependents'),
            meta: {
              title: '家属管理',
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
          title: '全部活动',
          permissions: ['shopadmin.marketing.apply.registrationactivity']
        },
        children: [
          {
            path: 'editor',
            component: () => import('@/view/member/selfservice/registrationactivityadd'),
            meta: {
              title: '编辑活动',
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
          title: '报名记录',
          permissions: ['shopadmin.marketing.apply.registrationrecord']
        },
        children: [
          {
            path: 'detail',
            component: () => import('@/view/member/selfservice/registrationrecordetail'),
            meta: {
              title: '记录详情',
              hidden: true
            }
          },
          {
            path: 'editor',
            component: () => import('@/view/member/selfservice/regRecordUpload'),
            meta: {
              title: '记录编辑',
              hidden: true
            }
          }
        ]
      }
    ]
  }
]

export default routes
