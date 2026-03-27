/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '5286ac37.5b0520'
import Layout from '@/view/layout' // 主框架
import SubLayout from '@/view/sublayout' //

export default {
  path: '/applications',
  component: Layout,
  children: [
    {
      path: 'adapay/adapay_trades',
      name: '5286ac37.85b2f8',
      component: () => import('@/view/mall/sub_account/sub_account'),
      children: [
        {
          path: 'detail/:order_id',
          component: () => import('@/view/mall/sub_account/detail')
        }
      ]
    },
    {
      path: 'marketing/lottery',
      name: '5286ac37.283be6',
      component: () => import('@/view/marketing/lottery/list.vue'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/view/marketing/lottery/editor.vue')
        }
      ]
    },
    {
      path: 'adapay/adapay_cash',
      name: '5286ac37.db7971',
      component: () => import('@/view/mall/withdraw/withdraw')
    },
    {
      path: 'adapay/adapay_cash_setting',
      name: '5286ac37.b33aa1',
      component: () => import('@/view/mall/withdraw/withdraw_setting.vue')
    },
    {
      path: 'adapay/adapay_merchant_info',
      name: '5286ac37.ac7b4c',
      component: () => import('@/view/mall/accountopeninfo')
    },
    {
      path: 'adapay/adapay_member_audit',
      name: '5286ac37.5bf3b3',
      component: () => import('@/view/mall/marketing/openingapproval'),
      children: [
        {
          path: 'approve/:id?',
          component: () => import('@/view/mall/marketing/openingapproval/approve')
        }
      ]
    },
    {
      path: 'adapay/adapay_merchant',
      name: '5286ac37.eee869',
      component: () => import('@/view/base/setting/dealer'),
      children: [
        {
          path: '/',
          component: () => import('@/view/base/setting/dealer/account_info')
        },
        {
          path: 'picture',
          component: () => import('@/view/base/setting/dealer/upload_picture')
        },
        {
          path: 'pay_setting',
          component: () => import('@/view/base/setting/dealer/pay_setting')
        },
        {
          path: 'netin',
          component: () => import('@/view/base/setting/dealer/netin')
        }
      ]
    },
    {
      path: 'jfmall/jfgoods',
      name: '5286ac37.5782b6',
      component: () => import('@/view/applications/pointmall/list'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/applications/pointmall/add')
        },
        {
          path: 'physicalupload',
          name: '5286ac37.0d9697',
          component: () => import('@/view/applications/pointmall/goodsImport')
        },
        {
          path: 'physicalstoreupload',
          name: '5286ac37.e9f31e',
          component: () => import('@/view/applications/pointmall/storeImport')
        }
      ]
    },
    {
      path: 'jfmall/jforders',
      name: '5286ac37.72ab0d',
      component: () => import('@/view/applications/pointmall/orderList'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/applications/pointmall/orderDetail')
        }
      ]
    },
    {
      path: 'jfmall/jfsetting',
      name: '5286ac37.0aeca0',
      component: () => import('@/view/applications/pointmall/setting')
    },
    {
      path: 'appsgroup/extapp',
      name: '5286ac37.e7a708',
      component: () => import('@/view/applications/plugin'),
      children: [
        {
          path: 'detail/:id?',
          component: () => import('@/view/applications/plugin/appDetail.vue')
        }
      ]
    },
    {
      path: 'bspay/user_audit',
      name: '5286ac37.285c7b',
      component: () => import('@/view/mall/marketing/huifuBspay'),
      children: [
        {
          path: 'approve/:id?',
          component: () => import('@/view/mall/marketing/huifuBspay/approve')
        }
      ]
    },
    {
      path: 'bspay/trades',
      name: '5286ac37.85b2f8',
      component: () => import('@/view/mall/bspay_sub_account/sub_account'),
      children: [
        {
          path: 'detail/:order_id',
          component: () => import('@/view/mall/bspay_sub_account/detail')
        }
      ]
    },
    {
      path: 'ec/purchaseactivity',
      name: '5286ac37.6e5918',
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
      // component: () => import('@/view/member/promotions/purchase/index'),
      // children: [
      //   {
      //     path: 'editor',
      //     component: () => import('@/view/member/promotions/purchase/editor')
      //   },
      //   {
      //     path: 'detail',
      //     component: () => import('@/view/member/promotions/purchase/detail')
      //   },
      //   {
      //     path: 'dependents',
      //     component: () => import('@/view/member/promotions/purchase/dependents')
      //   }
      // ]
    },
    {
      path: 'ec/employee',
      name: '5286ac37.b33603',
      component: () => import('@/view/member/purchase/employee'),
      children: [
        {
          path: 'import',
          name: '5286ac37.eba44e',
          component: () => import('@/view/member/purchase/employeeImport')
        }
      ]
    },
    {
      path: 'ec/company',
      name: '5286ac37.07c516',
      component: () => import('@/view/member/purchase/company')
    },
    {
      path: 'ec/purchaseorder',
      name: '5286ac37.d753bc',
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
      path: 'guide/workwechat',
      name: '5286ac37.fc99ea',
      component: () => import('@/view/base/setting/workwechat/workwechat')
    },
    {
      path: 'guide/salespersonshelfindex',
      name: '5286ac37.af488e',
      component: () => import('@/view/wxapp/salespersonshelfindex')
    },
    {
      path: 'community/tradecommunityorders',
      name: '5286ac37.991e15',
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
    },
    {
      path: 'community/communitysetting',
      name: '5286ac37.b6453a',
      component: () => import('@/view/member/promotions/community/setting')
    },
    {
      path: 'community/marketingcommunity',
      name: '5286ac37.62efd2',
      component: () => import('@/view/member/promotions/community/index'),
      children: [
        {
          path: 'editor/:community_id?',
          component: () => import('@/view/member/promotions/community/add')
        },
        {
          path: 'detail',
          meta: {
            title: `${name}-社区活动-社区管理-详情`
          },
          component: () => import('@/view/member/promotions/community/points')
        }
      ]
    },
    {
      path: 'community/marketingcommunityactivity',
      name: '5286ac37.d285a2',
      component: () => import('@/view/member/promotions/community/activity/index'),
      children: [
        {
          path: 'editor/:activity_id?',
          component: () => import('@/view/member/promotions/community/activity/add')
        }
      ]
    },
    {
      path: 'community/marketingdeliveryorder',
      name: '5286ac37.191e34',
      component: () => import('@/view/member/promotions/community/deliveryorder'),
      children: [
        {
          path: 'detail/:delivery_id?',
          component: () => import('@/view/member/promotions/community/deliverydetail')
        }
      ]
    },
    {
      path: 'community/communitywithdraw',
      name: '5286ac37.ac4d53',
      component: () => import('@/view/member/promotions/community/withdraw')
    },
    {
      path: 'community/communityactivityorder',
      name: '5286ac37.1ad244',
      component: () => import('@/view/member/promotions/community/activity/orderList'),
      children: [
        {
          path: 'detail',
          component: () => import('@/view/mall/trade/order/detail')
        }
      ]
    },
    {
      path: 'community/chief',
      name: '5286ac37.0303d0',
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
    },
    {
      path: 'community/activity',
      name: '5286ac37.d285a2',
      component: () => import('@/view/mall/community/activityList')
    },
    {
      path: 'community/communitygoods',
      name: '5286ac37.42f9f7',
      component: () => import('@/view/mall/community/communitygoods')
    },
    {
      path: 'community/order',
      name: '5286ac37.afcd11',
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
    },
    {
      path: 'community/setting',
      name: '5286ac37.b24f85',
      component: () => import('@/view/mall/community/setting')
    },
    {
      path: 'community/subdistrict',
      name: '5286ac37.814849',
      component: () => import('@/view/mall/subdistrict/list')
    },
    {
      path: 'community/achievement',
      name: '5286ac37.09cfa9',
      component: () => import('@/view/mall/community/achievement')
    },
    {
      path: 'community/withdraw',
      name: '5286ac37.33011e',
      component: () => import('@/view/mall/community/withdraw')
    },
    {
      path: 'community/adapay_cash',
      name: '5286ac37.db7971',
      component: () => import('@/view/mall/withdraw/withdraw')
    },
    {
      path: 'community/subdistrict',
      name: '5286ac37.814849',
      component: () => import('@/view/mall/subdistrict/list')
    },
    {
      path: 'community/chiefupload',
      name: '5286ac37.5ad881',
      component: () => import('@/view/member/members/upload_chief')
    }
  ]
}
