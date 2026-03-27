/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Layout from '@/view/layout' // 主框架
import SubLayout from '@/view/sublayout' //

export default {
  path: '/marketing',
  component: Layout,
  children: [
    {
      path: 'employee/purchase',
      name: '90713176.d0465c',
      component: SubLayout,
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
      path: 'coupon/membermarketing',
      name: '90713176.d43522',
      component: () => import('@/view/member/cardticket/coupon'),
      children: [
        {
          path: 'editor',
          component: () => import('@/view/member/cardticket/edit')
        },
        {
          path: 'detail',
          component: () => import('@/view/member/cardticket/detail')
        },
        {
          path: 'info',
          component: () => import('@/view/member/cardticket/info')
        }
      ]
    },
    {
      path: 'interactive/lottery',
      name: '90713176.283be6',
      component: () => import('@/view/marketing/lottery/list.vue'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/view/marketing/lottery/editor.vue')
        }
      ]
    },
    {
      path: 'coupon/couponspackage',
      name: '90713176.e12325',
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
    },
    {
      path: 'coupon/coupongive',
      name: '90713176.5c0da8',
      component: () => import('@/view/member/coupon/giveLog'),
      children: [
        {
          path: 'detail/:id?',
          component: () => import('@/view/member/coupon/giveErrorLog')
        }
      ]
    },
    {
      path: 'coupon/couponsend',
      name: '90713176.dfa362',
      component: () => import('@/views/members/member_list'),
      children: [
        {
          path: 'detail',
          component: () => import('@/view/member/members/detail')
        }
      ]
    },

    /** 会员营销 */
    {
      path: 'membermarket/marketingindex',
      name: '90713176.668339',
      component: () => import('@/view/member/promotions/index')
    },
    {
      path: 'membermarket/specificcrowddiscount',
      name: '90713176.05b6c8',
      component: () => import('@/view/member/promotions/specificcrowd/specificcrowddiscount'),
      children: [
        {
          path: 'detail/:id',
          component: () => import('@/view/member/promotions/specificcrowd/userdiscoutlog')
        }
      ]
    },
    {
      path: 'membermarket/memberpreference',
      name: '90713176.e10284',
      component: () => import('@/view/member/promotions/memberpreference/list'),
      children: [
        {
          path: 'editor/:marketing_id?',
          component: () => import('@/view/member/promotions/memberpreference/add')
        }
      ]
    },
    {
      path: 'membermarket/marketingactivity',
      name: '90713176.375821',
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
    },
    {
      path: 'membermarket/recommendlike',
      name: '90713176.9223a7',
      component: () => import('@/view/member/promotions/recommendlike')
    },

    /** 会员营销 */

    {
      path: 'member/pointupvaluation',
      name: '90713176.c66d5b',
      component: () => import('@/view/member/promotions/pointupvaluation/list'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/view/member/promotions/pointupvaluation/add')
        }
      ]
    },
    {
      path: 'member/extrapoint',
      name: '90713176.2fac5c',
      component: () => import('@/view/member/promotions/extrapoint/list'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/view/member/promotions/extrapoint/editor')
        },
        {
          path: 'templ/:id?',
          component: () => import('@/view/member/promotions/extrapoint/templ')
        }
      ]
    },
    {
      path: 'marketing/apply/registrationactivity',
      name: '90713176.5e06be',
      component: () => import('@/view/member/selfservice/registrationactivity'),
      children: [
        {
          path: 'editor',
          component: () => import('@/view/member/selfservice/registrationactivityadd')
        }
      ]
    },

    {
      path: 'marketing/apply/Registrationrecord',
      name: '90713176.42a5b5',
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
    },

    {
      path: 'marketing/apply/formattrs',
      name: '90713176.f26faa',
      component: () => import('@/view/member/selfservice/formsettinglist'),
      children: [
        {
          path: 'editor/:itemId?',
          name: '90713176.c7d5c2',
          component: () => import('@/view/member/selfservice/formsettingadd')
        }
      ]
    },
    {
      path: 'marketing/apply/formtemplate',
      name: '90713176.59a9c2',
      component: () => import('@/view/member/selfservice/formtemplatelist'),
      children: [
        {
          path: 'editor/:itemId?',
          name: '90713176.2b9acd',
          component: () => import('@/view/member/selfservice/formtemplateadd')
        }
      ]
    },
    {
      path: 'marketing/apply/activityverifylist',
      name: '90713176.889d11',
      component: () => import('@/view/member/selfservice/activityverifylist')
    },

    // {
    //   path: 'purchase',
    //   name: `员工内购`,
    //   component: () => import('@/view/member/promotions/purchase/index')
    // },
    {
      path: 'wheel',
      name: '90713176.d58dfa',
      component: () => import('@/view/marketing/lottery/list.vue'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/view/marketing/lottery/editor.vue')
        }
      ]
    },

    {
      path: 'liveroomlist',
      name: '90713176.7bbe8e',
      component: () => import('@/view/mall/liveroom/list'),
      children: [
        {
          path: 'editor/:itemId?',
          meta: {
            title: '90713176.4c240e'
          },
          component: () =>
            import(
              /* webpackChunkName: "marketing-liveroomlist-editor" */ '@/view/mall/liveroom/replay'
            )
        }
      ]
    },
    {
      path: 'promotion/Marketingspluspricebuy',
      name: '90713176.1798d0',
      component: () => import('@/view/member/promotions/pluspricebuy/list'),
      children: [
        {
          path: 'editor/:marketing_id?',
          component: () => import('@/view/member/promotions/pluspricebuy/add')
        }
      ]
    },
    {
      path: 'promotion/marketingpackage',
      name: '90713176.22b477',
      component: () => import('@/view/member/promotions/package/list'),
      children: [
        {
          path: 'editor/:package_id?',
          component: () => import('@/view/member/promotions/package/add')
        }
      ]
    },
    {
      path: 'promotion/limitedtimesale',
      name: '90713176.a0aaca',
      component: () => import('@/view/member/promotions/limitedtimesale/list'),
      children: [
        {
          path: 'editor/:seckill_id?',
          component: () => import('@/view/member/promotions/limitedtimesale/add')
        }
      ]
    },

    {
      path: 'marketingseckill',
      name: '90713176.92325c',
      component: () => import('@/view/member/promotions/seckill/list'),
      children: [
        {
          path: 'editor/:seckill_id?',
          component: () => import('@/view/member/promotions/seckill/add')
        }
      ]
    },
    {
      path: 'promotion/marketingsfulldiscount',
      name: '90713176.c01301',
      component: () => import('@/view/member/promotions/fulldiscount/list'),
      children: [
        {
          path: 'editor/:marketing_id?',
          component: () => import('@/view/member/promotions/fulldiscount/add')
        }
      ]
    },
    {
      path: 'promotion/Marketingsfullminus',
      name: '90713176.561a3c',
      component: () => import('@/view/member/promotions/fullminus/list'),
      children: [
        {
          path: 'editor/:marketing_id?',
          component: () => import('@/view/member/promotions/fullminus/add')
        }
      ]
    },
    {
      path: 'promotion/Marketingsfullgift',
      name: '90713176.1a4f21',
      component: () => import('@/view/member/promotions/fullgift/list'),
      children: [
        {
          path: 'editor/:marketing_id?',
          component: () => import('@/view/member/promotions/fullgift/add')
        }
      ]
    },

    {
      path: 'fissionmarketing/groupsindex',
      name: '90713176.550703',
      component: () => import('@/view/member/groups/index'),
      children: [
        {
          path: 'editor/:groups_id?',
          component: () => import('@/view/member/groups/add')
        },
        {
          path: 'detail/:team_id?',
          meta: {
            title: '90713176.446d09'
          },
          component: () => import('@/view/member/groups/teamDetail')
        },
        {
          path: 'team/:groups_id?',
          component: () => import('@/view/member/groups/team')
        }
      ]
    },
    {
      path: 'fissionmarketing/marketingbargain',
      name: '90713176.d84526',
      component: () => import('@/view/member/bargain/index'),
      children: [
        {
          path: 'editor/:bargain_id?',
          component: () => import('@/view/member/bargain/add')
        }
      ]
    },
    {
      path: 'popularize/popularizesetting',
      name: '90713176.0aeca0',
      component: () => import('@/view/popularize/setting')
    },
    {
      path: 'popularize/promotersetting',
      name: '90713176.917de5',
      component: () => import('@/view/popularize/promoterSetting')
    },
    {
      path: 'popularize/popularizelist',
      name: '90713176.f08fa2',
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
    },
    {
      path: 'popularize/popularizedata',
      name: '90713176.251493',
      component: () => import('@/view/popularize/data'),
      children: [
        {
          path: 'detail',
          component: () => import('@/view/popularize/brokerageLog')
        }
      ]
    },
    {
      path: 'popularize/popularizewithdraw',
      name: '90713176.33011e',
      component: () => import('@/view/popularize/withdraw')
    },
    {
      path: 'popularize/popularizegoods',
      name: '90713176.ad8d69',
      component: () => import('@/view/popularize/goods')
    },
    {
      path: 'popularize/taskbrokerage',
      name: '90713176.4b43b0',
      component: () => import('@/view/popularize/taskBrokerage')
    },
    {
      path: 'popularize/taskbrokeragecount',
      name: '90713176.98aee0',
      component: () => import('@/view/popularize/taskBrokerageCount')
    },
    {
      path: 'popularize/popularizegoodsAudit',
      name: '90713176.417559',
      component: () => import('@/view/popularize/goodsAudit')
    }
    // {
    //   path: 'popularize/popularizegoodsAudit',
    //   name: `商家分润`,
    //   component: () => import('@/view/popularize/goodsAudit')
    // },
  ]
}
