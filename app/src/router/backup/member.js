import Home from '@/view/home'
import Layout from '@/view/layout'

/* 会员管理 */
import member from '@/view/member/members/list'
import memberDetail from '@/view/member/members/detail'
import registerSetting from '@/view/member/registersetting/index'
import memberCardIndex from '@/view/member/membercard/index'
import memberCardList from '@/view/member/membercard/list'
import memberUploade from '@/view/member/members/uploade'
import memberTag from '@/view/member/members/tags'

/* 会员数据统计 */
import rightsList from '@/view/member/members/rightsList'

/* 营销 */
import Coupon from '@/view/member/cardticket/coupon'
import CouponGive from '@/view/member/coupon/giveLog'
import CouponGiveInfo from '@/view/member/coupon/giveErrorLog'
import CouponDetail from '@/view/member/cardticket/detail'
import registerRromotions from '@/view/member/promotions/index'
import registerRromotionsAdd from '@/view/member/promotions/distributorEdit'
import CardTicketEdit from '@/view/member/cardticket/edit'
import bargainAdd from '@/view/member/bargain/add'
import bargain from '@/view/member/bargain/index'
import activity from '@/view/member/activity/index'
import activityTempl from '@/view/member/activity/templ'
import activityAdd from '@/view/member/activity/add'
import groups from '@/view/member/groups/index'
import groupsAdd from '@/view/member/groups/add'
import groupsTeam from '@/view/member/groups/team'
import groupsTeamInfo from '@/view/member/groups/teamDetail'
import popularizeSetting from '@/view/popularize/setting'
import promoterSetting from '@/view/popularize/promoterSetting'
import popularizeList from '@/view/popularize/list'
import popularizeChildren from '@/view/popularize/children'
import popularizeWithdraw from '@/view/popularize/withdraw'
import popularizeBrokerageLogs from '@/view/popularize/brokerageLog'
import memberPoint from '@/view/member/point/index'

/* 自助表单生成 */
import SelfServiceForm from '@/view/member/selfservice/index'
import FormTemplateAdd from '@/view/member/selfservice/formtemplateadd'
import FormSettingAdd from '@/view/member/selfservice/formsettingadd'
import UserDaliyRecord from '@/view/member/selfservice/userdaliyrecord'

/*社区活动*/
import CommunityList from '@/view/member/promotions/community/index'
import CommunityPointList from '@/view/member/promotions/community/points'
import CommunityAdd from '@/view/member/promotions/community/add'

import ActivityList from '@/view/member/promotions/community/activity/index'
import ActivityAdd from '@/view/member/promotions/community/activity/add'
import DeliveryOrder from '@/view/member/promotions/community/deliveryorder'
import DeliveryOrderDetail from '@/view/member/promotions/community/deliverydetail'
import communitySetting from '@/view/member/promotions/community/setting'
import communityWithdraw from '@/view/member/promotions/community/withdraw'
import CommunityActivityOrders from '@/view/member/promotions/community/activity/orderList'

import memberCheckIn from '@/view/member/members/checkinList'

import SeckillActivityList from '@/view/member/promotions/seckill/list'
import SeckillActivityAdd from '@/view/member/promotions/seckill/add'

/*抽奖活动*/
import LuckyDraw from '@/view/member/promotions/luckydraw/index'
import LuckydrawAdd from '@/view/member/promotions/luckydraw/add'
import LuckyDrawTeam from '@/view/member/promotions/luckydraw/team'
import LuckyDrawTeamInfo from '@/view/member/promotions/luckydraw/teamDetail'
import LuckyDrawTeamShow from '@/view/member/promotions/luckydraw/luckydrawshow'
import LuckyDrawRules from '@/view/member/promotions/luckydraw/luckydrawrule'

import fullDiscountMarketingList from '@/view/member/promotions/fulldiscount/list'
import fullDiscountMarketingAdd from '@/view/member/promotions/fulldiscount/add'

import fullMinusMarketingList from '@/view/member/promotions/fullminus/list'
import fullMinusMarketingAdd from '@/view/member/promotions/fullminus/add'

import fullGiftMarketingList from '@/view/member/promotions/fullgift/list'
import fullGiftMarketingAdd from '@/view/member/promotions/fullgift/add'

import Wheel from '@/view/member/promotions/wheel/index' // 大转盘抽奖

export default {
  path: '/member',
  name: '会员',
  component: Home,
  meta: '3',
  children: [
    {
      path: '/member',
      name: '会员管理',
      component: Layout,
      iconCls: 'supervisor_account',
      children: [
        //{ path: '/member', component: Main, meta: '3', name: '业绩分析' },
        { path: '/member', component: member, meta: '3', name: '会员资产' },
        {
          path: '/member/manage/members/detail',
          component: memberDetail,
          meta: '3',
          name: '会员详情',
          hidden: true
        },
        {
          path: '/member/manage/infomation',
          component: registerSetting,
          meta: '3',
          name: '会员注册信息'
        },
        {
          path: '/member/manage/card',
          component: memberCardIndex,
          meta: '3',
          name: '会员卡与等级'
        },
        {
          path: '/member/manage/cardOrder',
          component: memberCardList,
          meta: '3',
          name: '会员卡购买记录'
        },
        {
          path: '/member/manage/customer',
          component: memberUploade,
          meta: '3',
          name: '会员信息导入'
        },
        { path: '/member/manage/tag', component: memberTag, meta: '3', name: '会员标签' },
        { path: '/member/checkinlist', component: memberCheckIn, meta: '3', name: '会员签到记录' }
      ]
    },
    {
      path: '/member/analysis',
      name: '会员数据统计',
      component: Layout,
      iconCls: 'assessment',
      children: [
        //{ path: '/member/analysis', component: Main, meta: '3', name: '会员360' },
        //{ path: '/member/analysis/group', component: Main, meta: '3', name: '会员分组' },
        { path: '/member/analysis/rights', component: rightsList, meta: '3', name: '会员权益列表' }
        //{ path: '/member/analysis/data', component: Main, meta: '3', name: '数据定义' }
      ]
    },
    {
      path: '/member/marketing',
      name: '营销',
      component: Layout,
      iconCls: 'confirmation_number',
      children: [
        { path: '/member/marketing', component: Coupon, meta: '3', name: '优惠券管理' },
        { path: '/member/marketing/coupon/send', component: member, meta: '3', name: '发放优惠券' },
        { path: '/member/marketing/sms/send', component: member, meta: '3', name: '发放短信' },
        {
          path: '/member/marketing/coupon/give',
          component: CouponGive,
          meta: '3',
          name: '优惠券后台发放日志'
        },
        {
          path: '/member/marketing/coupon/give/:id',
          component: CouponGiveInfo,
          meta: '3',
          name: '优惠券后台发放日志详情',
          hidden: true
        },
        {
          path: '/member/marketing/coupon',
          component: CardTicketEdit,
          meta: '3',
          name: '编辑优惠券',
          hidden: true
        },
        {
          path: '/member/marketing/coupons/detail',
          component: CouponDetail,
          meta: '3',
          name: '编辑优惠券详情',
          hidden: true
        },
        //{ path: '/member/marketing/statistics', component: Main, meta: '3', name: '优惠券统计' },
        { path: '/member/marketing/activity', component: activity, meta: '3', name: '自动化营销' },
        {
          path: '/member/marketing/activity/template',
          component: activityTempl,
          meta: '3',
          name: '选择活动模板',
          hidden: true
        },
        {
          path: '/member/marketing/activity/add/:type',
          component: activityAdd,
          meta: '3',
          name: '添加活动',
          hidden: true
        },
        {
          path: '/member/marketing/index',
          component: registerRromotions,
          meta: '3',
          name: '注册促销'
        },
        {
          path: '/member/marketing/register',
          component: registerRromotionsAdd,
          meta: '4',
          name: '添加注册促销',
          hidden: true
        },
        {
          path: '/member/marketing/register/:id',
          component: registerRromotionsAdd,
          meta: '4',
          name: '编辑注册促销',
          hidden: true
        },
        { path: '/member/marketing/bargain', component: bargain, meta: '3', name: '微信助力' },
        {
          path: '/member/marketing/bargain/add',
          component: bargainAdd,
          meta: '3',
          name: '添加微信助力',
          hidden: true
        },
        {
          path: '/member/marketing/bargain/add/:bargain_id',
          component: bargainAdd,
          meta: '3',
          name: '编辑微信助力',
          hidden: true
        },
        { path: '/member/marketing/groups/index', component: groups, meta: '3', name: '拼团活动' },
        {
          path: '/member/marketing/groups/add',
          component: groupsAdd,
          meta: '3',
          name: '添加拼团活动',
          hidden: true
        },
        {
          path: '/member/marketing/groups/add/:groups_id',
          component: groupsAdd,
          meta: '3',
          name: '编辑拼团活动',
          hidden: true
        },
        {
          path: '/member/marketing/groups/team/:groups_id',
          component: groupsTeam,
          meta: '3',
          name: '拼团活动详情',
          hidden: true
        },
        {
          path: '/member/marketing/groups/team/info/:team_id',
          component: groupsTeamInfo,
          meta: '3',
          name: '拼团活动数据',
          hidden: true
        },
        { path: '/popularize/setting', component: popularizeSetting, name: '分销推广配置' },
        {
          path: '/popularize/promoter/setting',
          component: promoterSetting,
          name: '推广员等级配置'
        },
        { path: '/popularize/list', component: popularizeList, name: '推广员列表' },
        { path: '/popularize/children', component: popularizeChildren, name: '推广员直属下级列表' },
        { path: '/popularize/withdraw', component: popularizeWithdraw, name: '推广员提现申请' },
        { path: '/popularize/logs', component: popularizeBrokerageLogs, name: '佣金记录' },

        {
          path: '/member/marketing/community',
          component: CommunityList,
          meta: '3',
          name: '社区管理'
        },
        {
          path: '/member/marketing/community/add',
          component: CommunityAdd,
          meta: '3',
          name: '添加社区管理',
          hidden: true
        },
        {
          path: '/member/marketing/community/add/:community_id',
          component: CommunityAdd,
          meta: '3',
          name: '编辑社区管理',
          hidden: true
        },
        {
          path: '/member/marketing/communityactivity',
          component: ActivityList,
          meta: '3',
          name: '活动管理'
        },
        {
          path: '/member/marketing/communityactivity/add',
          component: ActivityAdd,
          meta: '3',
          name: '添加活动管理',
          hidden: true
        },
        {
          path: '/member/marketing/communityactivity/add/:activity_id',
          component: ActivityAdd,
          meta: '3',
          name: '编辑活动管理',
          hidden: true
        },
        {
          path: '/member/marketing/deliveryorder',
          component: DeliveryOrder,
          name: '配送单',
          hidden: true
        },
        {
          path: '/member/marketing/deliveryorder/:delivery_id',
          component: DeliveryOrderDetail,
          meta: '3',
          name: '配送单详情',
          hidden: true
        },
        {
          path: '/member/marketing/community/setting',
          component: communitySetting,
          meta: '3',
          name: '设置社区拼团',
          hidden: true
        },
        {
          path: '/member/marketing/community/withdraw',
          component: communityWithdraw,
          meta: '3',
          name: '社区拼团提现',
          hidden: true
        },
        {
          path: '/member/marketing/communityactivity/order',
          component: CommunityActivityOrders,
          meta: '3',
          name: '社区活动订单'
        },
        {
          path: '/member/marketing/community/points',
          component: CommunityPointList,
          meta: '3',
          name: '社区积分记录'
        },
        { path: '/member/point', component: memberPoint, name: '积分管理' },

        {
          path: '/member/marketing/seckill',
          component: SeckillActivityList,
          meta: '3',
          name: '秒杀活动'
        },
        {
          path: '/member/marketing/seckill/add',
          component: SeckillActivityAdd,
          meta: '3',
          name: '秒杀活动添加',
          hidden: true
        },
        {
          path: '/member/marketing/seckill/add/:seckill_id',
          component: SeckillActivityAdd,
          meta: '3',
          name: '秒杀活动编辑',
          hidden: true
        },

        {
          path: '/member/marketing/luckydraw/index',
          component: LuckyDraw,
          meta: '3',
          name: '抽奖活动'
        },
        {
          path: '/member/marketing/luckydraw/add',
          component: LuckydrawAdd,
          meta: '3',
          name: '添加抽奖活动',
          hidden: true
        },
        {
          path: '/member/marketing/luckydraw/add/:luckydraw_id',
          component: LuckydrawAdd,
          meta: '3',
          name: '编辑抽奖活动',
          hidden: true
        },
        {
          path: '/member/marketing/luckydraw/team/:luckydraw_id',
          component: LuckyDrawTeam,
          meta: '3',
          name: '抽奖活动详情',
          hidden: true
        },
        {
          path: '/member/marketing/luckydraw/team/info/:luckydraw_id',
          component: LuckyDrawTeamInfo,
          meta: '3',
          name: '抽奖活动数据',
          hidden: true
        },
        {
          path: '/member/marketing/luckydraw/show',
          component: LuckyDrawTeamShow,
          meta: '3',
          name: '抽奖轮播图',
          hidden: true
        },
        {
          path: '/member/marketing/luckydraw/rules',
          component: LuckyDrawRules,
          meta: '3',
          name: '抽奖规则',
          hidden: true
        },

        {
          path: '/member/marketing/fulldiscount',
          component: fullDiscountMarketingList,
          meta: '3',
          name: '满折促销'
        },
        {
          path: '/member/marketing/fulldiscount/add',
          component: fullDiscountMarketingAdd,
          meta: '3',
          name: '满折促销添加',
          hidden: true
        },
        {
          path: '/member/marketing/fulldiscount/add/:marketing_id',
          component: fullDiscountMarketingAdd,
          meta: '3',
          name: '满折促销编辑',
          hidden: true
        },

        {
          path: '/member/marketing/fullminus',
          component: fullMinusMarketingList,
          meta: '3',
          name: '满减促销'
        },
        {
          path: '/member/marketing/fullminus/add',
          component: fullMinusMarketingAdd,
          meta: '3',
          name: '满减促销添加',
          hidden: true
        },
        {
          path: '/member/marketing/fullminus/add/:marketing_id',
          component: fullMinusMarketingAdd,
          meta: '3',
          name: '满减促销编辑',
          hidden: true
        },

        {
          path: '/member/marketing/fullgift',
          component: fullGiftMarketingList,
          meta: '3',
          name: '满赠促销'
        },
        {
          path: '/member/marketing/fullgift/add',
          component: fullGiftMarketingAdd,
          meta: '3',
          name: '满赠促销添加',
          hidden: true
        },
        {
          path: '/member/marketing/fullgift/add/:marketing_id',
          component: fullGiftMarketingAdd,
          meta: '3',
          name: '满赠促销编辑',
          hidden: true
        },
        {
          path: '/member/marketing/wheel',
          component: Wheel,
          meta: '3',
          name: '大转盘',
          hidden: true
        }
      ]
    }
    //{
    // path: '/member/selfservice',
    // name: '自助表单',
    // component: Layout,
    // iconCls: 'local_play',
    // children: [
    //   { path: '/member/selfservice', component: SelfServiceForm, meta: '3', name: '自助表单' },
    //   { path: '/member/selfservice/formtemplateadd', component: FormTemplateAdd, meta: '4', name: '添加表单模板', hidden: true },
    //   { path: '/member/selfservice/formtemplateadd/:id', component: FormTemplateAdd, meta: '4', name: '编辑表单模板', hidden: true },
    //   { path: '/member/selfservice/formsettingadd', component: FormSettingAdd, meta: '4', name: '添加表单元素', hidden: true },
    //   { path: '/member/selfservice/formsettingadd/:id', component: FormSettingAdd, meta: '4', name: '编辑表单元素', hidden: true },
    // ]
    //},
    //{
    //  path: '/member/integral',
    //  name: '会员积分',
    //  component: Layout,
    //  iconCls: 'local_play',
    //  children: [
    //    { path: '/member/integral', component: Main, meta: '3', name: '积分统计' },
    //    { path: '/member/integral/rule', component: Main, meta: '3', name: '积分制度设定' },
    //    { path: '/member/integral/import', component: Main, meta: '3', name: '积分导入' },
    //    { path: '/member/integral/mall', component: Main, meta: '3', name: '积分商城' }
    //  ]
    //},
    //{
    //  path: '/member/interactive',
    //  name: '会员互动',
    //  component: Layout,
    //  iconCls: 'recent_actors',
    //  children: [
    //    { path: '/member/interactive', component: Main, meta: '3', name: '福袋' },
    //    { path: '/member/interactive/lottery', component: Main, meta: '3', name: '幸运大抽奖' },
    //    { path: '/member/interactive/share', component: Main, meta: '3', name: '分享有礼' }
    //  ]
    //},
    //{
    //  path: '/member/communities',
    //  name: '会员社群',
    //  component: Layout,
    //  iconCls: 'supervisor_account',
    //  leaf: true,
    //  children: [
    //    { path: '/member/communities', component: Main, meta: '3', name: '会员社群' }
    //  ]
    //}
  ]
}
