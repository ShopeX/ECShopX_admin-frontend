// 会员路由
const name = '营销'
import Layout from '@/view/layout' // 主框架
import SubLayout from '@/view/sublayout' //

export default {
  path: '/marketing',
  component: Layout,
  children: [
    {
      path: 'employee/purchase',
      name: `内购`,
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
      name: `优惠卷管理`,
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
    },
    {
      path: 'interactive/lottery',
      name: '抽奖活动',
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
      name: '劵包管理',
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
      name: `优惠券发放日志`,
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
      name: `群发优惠券`,
      component: () => import('@/view/member/members/list'),
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
      name: `新客营销`,
      component: () => import('@/view/member/promotions/index')
    },
    {
      path: 'membermarket/specificcrowddiscount',
      name: `定向促销`,
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
      name: `会员优选购`,
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
      name: `自动化营销`,
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
      name: `热门推荐`,
      component: () => import('@/view/member/promotions/recommendlike')
    },

    /** 会员营销 */

    {
      path: 'member/pointupvaluation',
      name: `积分升值`,
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
      name: `额外积分`,
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
      name: `全部活动`,
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
      name: `报名记录`,
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
      name: `表单元素`,
      component: () => import('@/view/member/selfservice/formsettinglist'),
      children: [
        {
          path: 'editor/:itemId?',
          name: `表单元素配置-编辑`,
          component: () => import('@/view/member/selfservice/formsettingadd')
        }
      ]
    },
    {
      path: 'marketing/apply/formtemplate',
      name: `表单模板`,
      component: () => import('@/view/member/selfservice/formtemplatelist'),
      children: [
        {
          path: 'editor/:itemId?',
          name: `表单模板配置-编辑`,
          component: () => import('@/view/member/selfservice/formtemplateadd')
        }
      ]
    },
    {
      path: 'marketing/apply/activityverifylist',
      name: `活动核销记录`,
      component: () => import('@/view/member/selfservice/activityverifylist'),
    },

    // {
    //   path: 'purchase',
    //   name: `员工内购`,
    //   component: () => import('@/view/member/promotions/purchase/index')
    // },
    {
      path: 'wheel',
      name: `大转盘配置`,
      component: () => import('@/view/member/promotions/wheel/index')
    },

    {
      path: 'liveroomlist',
      name: `直播`,
      component: () => import('@/view/mall/liveroom/list'),
      children: [
        {
          path: 'editor/:itemId?',
          meta: {
            title: `${name}-活动报名-活动报名-直播-编辑`
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
      name: `加价购管理`,
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
      name: `组合商品管理`,
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
      name: `限时特惠`,
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
      name: `限时秒杀`,
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
      name: `满折管理`,
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
      name: `满减管理`,
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
      name: `满赠管理`,
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
      name: `拼团活动`,
      component: () => import('@/view/member/groups/index'),
      children: [
        {
          path: 'editor/:groups_id?',
          component: () => import('@/view/member/groups/add')
        },
        {
          path: 'detail/:team_id?',
          meta: {
            title: `${name}-活动报名-活动报名-满赠管理-详情`
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
      name: `微信助力`,
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
      name: `基础设置`,
      component: () => import('@/view/popularize/setting')
    },
    {
      path: 'popularize/promotersetting',
      name: `推广员等级`,
      component: () => import('@/view/popularize/promoterSetting')
    },
    {
      path: 'popularize/popularizelist',
      name: `推广员列表`,
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
      name: `推广员业绩`,
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
      name: `提现申请`,
      component: () => import('@/view/popularize/withdraw')
    },
    {
      path: 'popularize/popularizegoods',
      name: `分销商品`,
      component: () => import('@/view/popularize/goods')
    },
    {
      path: 'popularize/taskbrokerage',
      name: `任务佣金明细`,
      component: () => import('@/view/popularize/taskBrokerage')
    },
    {
      path: 'popularize/taskbrokeragecount',
      name: `任务佣金统计`,
      component: () => import('@/view/popularize/taskBrokerageCount')
    },
    {
      path: 'popularize/popularizegoodsAudit',
      name: `分销池审核`,
      component: () => import('@/view/popularize/goodsAudit')
    },
    // {
    //   path: 'popularize/popularizegoodsAudit',
    //   name: `商家分润`,
    //   component: () => import('@/view/popularize/goodsAudit')
    // },
  ]
}
