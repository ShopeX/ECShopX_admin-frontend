// 菜单路由
import Dashboard from '@/view/base/index' // 首页仪表盘
import Shopwxshop from '@/view/base/shop/wxshop' // 微信门店管理
import Wxshopsetting from '@/view/base/shop/shopsetting' // 门店信息配置
import Comments from '@/view/base/shop/comments' // 门店评论
import Assetpayment from '@/view/base/setting/payment' // 微信支付账户配置
import Assetaccountactivation from '@/view/base/asset/accountactivation/index' // 订购续费
import Datamessage from '@/view/base/shortmessage/index' // 短信账户
import Staffleader from '@/view/base/shopstaff/salesperson/leaderlist' // 门店管理员
import Accountmanagement from '@/view/base/account/management' // 平台管理员 --
import Accountroles from '@/view/base/account/roles' // 角色管理 --
import Basearticle from '@/view/base/article/index' // 文章管理
import Basecurrency from '@/view/base/currency/index' // 货币管理
import Baseexport from '@/view/base/exportlog/index' // 日志导出
import Brand from '@/view/brand/wechat/open' // 公众号授权
import Brandcustomer from '@/view/brand/wechat/customservice' // 公众号客服管理
import Brandmenu from '@/view/brand/wechat/custommenu' // 自定义公众号菜单
import Brandreply from '@/view/brand/wechat/reply' // 公众号消息自动回复设置
import Brandfans from '@/view/brand/wechat/fans' // 公众号粉丝管理
import Brandmaterial from '@/view/brand/wechat/aterialmanagement' // 素材管理
import Goodscategory from '@/view/mall/goods/category' // 商品分类
import Goodsmaincategory from '@/view/mall/goods/maincategory' // 商品分类
import Servicegoods from '@/view/mall/goods/service/index' // 服务类商品管理
import Goodsphysical from '@/view/mall/goods/physical/list' // 实体类商品
import Physicalupload from '@/view/mall/goods/physical/normalGoodsUpload' // 实体商品导入
import Physicalstoreupload from '@/view/mall/goods/physical/normalGoodsStoreUpload' // 实体商品库存导入
import Itemstagupload from '@/view/mall/goods/physical/normalGoodsTagUpload' // 实体商品标签导入
import Physicalprofitupload from '@/view/mall/goods/physical/normalGoodsProfitUpload' // 实体商品分润导入
import Goodsbrand from '@/view/mall/goods/attributes/brand' // 商品品牌管理
import Arrivalnotice from '@/view/member/subscribe/goods/list' // 到货通知
import Servicepayment from '@/view/mall/trade/list' // 交易单管理
import Tradeservice from '@/view/mall/trade/order/list' // 服务订单管理
import Tradenormalorders from '@/view/mall/trade/normalorders/list' // 实物订单管理
import Tradecommunityorders from '@/view/mall/trade/normalorders/list' // 社区团购订单管理
import Tradenormalshoporders from '@/view/mall/trade/normalorders/shopList' // 自营订单管理
import Tradedrugorders from '@/view/mall/trade/normalorders/drugList' // 药品需求单
import Tradepayment from '@/view/mall/trade/list' // 交易单管理
import Tradeverification from '@/view/mall/trade/salesmanWorkRecords' // 服务核销单
import Shippingtemplates from '@/view/mall/trade/shipping/templates' // 运费模版
import Marketingdistributor from '@/view/mall/marketing/distributor' // 店铺管理
import Marketingdistributor_editor from '@/view/mall/marketing/distributor_editor/index' // 店铺编辑Marketing
import Marketingdistributor_template from '@/view/mall/marketing/distributor_template' // 店铺编辑Marketing
import Marketingdistribution_orders from '@/view/mall/marketing/distributionOrders' // 店铺订单
import Marketingdistributor_wxpaysetting from '@/view/mall/marketing/distributor_wxpaysetting' // 店铺微信支付配置
import Distributortags from '@/view/mall/marketing/distributortags' // 商品标签
import Distributorrel_items from '@/view/mall/marketing/distributorRelItems' // 店铺关联商品
// import Distributoraftersalesaddress from '@/view/mall/marketing/distributorAftersalesAddress' //店铺售后地址
import Distributorinvoice from '@/view/mall/marketing/distributorInvoice' // 店铺发票
import Marketinglog from '@/view/mall/marketing/distributionLog' // 店铺记录
import ShopDecoration from '@/view/mall/marketing/shopDecoration' // 微商城店铺装修
import DistributorCode from '@/view/mall/marketing/distributorCode' // 微商城店铺装修
import Marketingsalesman from '@/view/guide/salesman' // 导购员管理
import Marketingsalesmanrole from '@/view/guide/salemanRoleConfig' // 导购员管理
import ShoppingGuideTask from '@/view/guide/shoppingGuideTask' // 导购任务
import ShoppingGuideTask_statistics from '@/view/guide/shoppingGuideTaskStatistics' // 导购任务统计
import Shoppingguidenotification from '@/view/guide/shoppingguidenotification' // 导购员管理
import Salemancustomercomplaints from '@/view/guide/salemanCustomerComplaints' // 导购员客诉管理
import SalemanLoginHistory from '@/view/guide/SalemanLoginHistory' // 导购员登录记录
import SalesmanRelationship from '@/view/guide/salesman_relationship' // 导购会员关系
import Shopactivities from '@/view/guide/shopactivities' // 导购知识库
import Shopnoticetempl from '@/view/guide/shopnoticetempl' // 导购消息模版
import Reservationsetting from '@/view/mall/reservation/setting/index' // 预约设置
import Mallreservation from '@/view/mall/reservation/resourcesetting/index' // 预约管理
import Reservationorder from '@/view/mall/reservation/resourcesetting/reservation' // 预约单
import Mallrecharge from '@/view/mall/storeddeposit/index' // 会员账户储值
import Aftersaleslist from '@/view/mall/aftersales/list' // 售后单管理
import Aftersalesrefundlist from '@/view/mall/aftersales/refundList' // 退款单管理
import Aftersalesrefundlist_detail from '@/view/mall/aftersales/refundDetail' // 退款单详情
import Fapiaolist from '@/view/mall/fapiao/list' //发票列表
import Fapiao_set from '@/view/mall/fapiao/set' // 发票设置
import Fapiao_set_detail from '@/view/mall/fapiao/add' //添加发票
import Member from '@/view/member/members/list' // 会员管理
import Manageinfomation from '@/view/member/registersetting/index' // 会员注册信息
import Managecard from '@/view/member/membercard/index' // 会员卡与等级设置
import Managecardorder from '@/view/member/membercard/list' // 会员卡购买记录
import Managecustomer from '@/view/member/members/uploade' // 会员信息导入 **
import Trustlogin from '@/view/member/trustlogin/list' // 信任登录列表
import Managetag from '@/view/member/members/tags' // 会员标签
import Analysisrights from '@/view/member/members/rightsList' // 会员权益管理
import AnalysisrightsContent from '@/view/member/members/analysisrightsContent' // 会员权益管理
import Membermarketing from '@/view/member/cardticket/coupon' // 优惠券管理
import Couponsend from '@/view/member/members/list' // 群发优惠券，与会员管理同一组件
import Smssend from '@/view/member/members/list' // 群发短信，与会员管理同一组件
import Coupongive from '@/view/member/coupon/giveLog' // 优惠券后台发放记录
import Chief from '@/view/member/coupon/giveLog' // 优惠券后台发放记录
import Coupongrantset from '@/view/member/cardticket/couponGrantSet' //优惠券发放管理设置
import Marketingindex from '@/view/member/promotions/index' // 注册营销
import Marketingbargain from '@/view/member/bargain/index' // 微信助力
import Marketingactivity from '@/view/member/activity/index' // 自动化营销
import Groupsindex from '@/view/member/groups/index' // 拼团活动管理
import Popularizesetting from '@/view/popularize/setting' // 分销设置
import Promotersetting from '@/view/popularize/promoterSetting' // 推广员等级设置
import Popularizelist from '@/view/popularize/list' // 推广员列表
import Popularizedata from '@/view/popularize/data' // 推广员列表
import Popularizewithdraw from '@/view/popularize/withdraw' // 分销提现
import Popularizegoods from '@/view/popularize/goods' // 推广商品
import PopularizegoodsAudit from '@/view/popularize/goodsAudit' // 推广商品审核
import Taskbrokerage from '@/view/popularize/taskBrokerage' // 任务佣金明细
import Taskbrokeragecount from '@/view/popularize/taskBrokerageCount' // 任务佣金统计
import Marketingcommunity from '@/view/member/promotions/community/index' // 社区管理
import Marketingcommunityactivity from '@/view/member/promotions/community/activity/index' // 活动管理
import Marketingdeliveryorder from '@/view/member/promotions/community/deliveryorder' // 配送单
import Communitysetting from '@/view/member/promotions/community/setting' // 社区活动设置
import Communitywithdraw from '@/view/member/promotions/community/withdraw' // 积分提现
import Communityactivityorder from '@/view/member/promotions/community/activity/orderList' // 社区活动订单
import Marketingseckill from '@/view/member/promotions/seckill/list' // 秒杀活动管理
import Limitedtimesale from '@/view/member/promotions/limitedtimesale/list' // 限时特惠活动管理
import Goodslimit from '@/view/member/promotions/goodslimit/list' // 商品限购管理
import Memberpreference from '@/view/member/promotions/memberpreference/list' // 会员优先购管理
import Wxapp from '@/view/wxapp/index' // 小程序列表
import Templateedit from '@/view/wxapp/management' // 小程序模板编辑
import Batemplateedit from '@/view/wxapp/bamanagement' // ba小程序模板编辑
import Pctemplate from '@/view/pc/homePage/default' // pc首页模板编辑
import Pcviptemplate from '@/view/pc/vipPage/default' // pc vip页面模板编辑
import Pcfootertext from '@/view/pc/footerPage/default' // pc 底部文案
import Tdkglobalset from '@/view/pc/tdk/globalset' // Tdk全局设置
import Tdkgivenset from '@/view/pc/tdk/givenset' // Tdk全局设置
import Pccustompage from '@/view/pc/custompage' // pc 自定义页面
import Editcategory from '@/view/wxapp/category' // 自定义小程序分类
import Custompage from '@/view/wxapp/custompage' // 自定义小程序页面
import Salespersonshelfindex from '@/view/wxapp/salespersonshelfindex' // 导购货架自定义小程序页面
import Floorguide from '@/view/wxapp/floor_guide' // 自定义楼层引导页面
import Colorstyle from '@/view/wxapp/color_style' // 自定义楼层引导页面
import Cartremind from '@/view/wxapp/cartremindmanagement' // 小程序购物车提醒
import Membercentersetting from '@/view/wxapp/member_center_setting' //会员中心设置
import Editdashboard from '@/view/wxapp/statistics/dataanalysis/index' // 小程序数据分析
import Editsourcemanagement from '@/view/wxapp/statistics/sourcemanagement/index' // 小程序千人千码
import Editauthorize from '@/view/wxapp/authorize/index' // 小程序授权
import Marketingsfulldiscount from '@/view/member/promotions/fulldiscount/list' // 满折活动列表
import Marketingsfullminus from '@/view/member/promotions/fullminus/list' // 满减活动列表
import Marketingsfullgift from '@/view/member/promotions/fullgift/list' // 满赠活动列表
import Marketingspluspricebuy from '@/view/member/promotions/pluspricebuy/list' // 加价购活动列表
import Marketingpackage from '@/view/member/promotions/package/list' // 组合促销促销
import Wheel from '@/view/member/promotions/wheel/index' // 大转盘抽奖
import Ordersetting from '@/view/mall/trade/ordersetting' // 订单时效配置
import Goodsattributes from '@/view/mall/goods/attributes/attributes' // 商品规格列表
import Goodsparams from '@/view/mall/goods/attributes/params' // 商品参数列表
import Storeshopitemanagement from '@/view/mall/storeshop/itemlist' // 店铺商品列表
import Merchantstaff from '@/view/base/account/storestaff' // 商城（店铺）员工管理
import Merchantstaffroles from '@/view/base/account/storeroles' // 商城（店铺）员工角色管理
import Platformstaff from '@/view/base/account/normalstaff' // 平台员工管理
import Platformstaffroles from '@/view/base/account/normalroles' // 平台员工角色管理
import Planting from '@/view/base/planting/index' // 种草列表
import Articlecolumns from '@/view/base/article/columns' // 文章栏目
import Articlegeneralcolumns from '@/view/base/article/generalcolumns' // 文章栏目

import Operatorlogs from '@/view/base/setting/companys/logs' // 商家操作日志列表

import Domain_setting from '@/view/base/setting/companys/domain' //域名配置

import Itemtags from '@/view/mall/goods/tags' // 商品标签
import Goodsaudit from '@/view/mall/goods/audit/list' // 商品标签
import Goodsaudit_editor from '@/view/mall/goods/audit/add' // 商品标签

import Selfdeliveryaddress from '@/view/base/address/setting' // 设置固定自提地址
import Distributoraftersalesaddress from '@/view/mall/marketing/distributorAftersalesAddress' //店铺售后地址

import Ordercartsetting from '@/view/mall/trade/cartadsetting' // 购物车广告营销语

import Recommendlike from '@/view/member/promotions/recommendlike' // 设置固定自提地址

import Omsqueuelog from '@/view/mall/trade/omsqueuelog' // 查看oms通信日志

import Refunderrorlogs from '@/view/mall/trade/refunderrorlogs' // 退款错误日志

import Rate from '@/view/mall/trade/rate/list' // 订单评价

import Certificate from '@/view/base/setting/certificate/index' // 授权

import DataAnalysis from '@/view/base/setting/dataAnalysis' // 数据分析配置

import GoodsShareSetting from '@/view/base/setting/goodsShareSetting' // 商品分享设置

import Wxappmanage from '@/view/wxapp/wxappmanage/list' // 小程序列表

// import Basic_setting from '@/view/mall/marketing/basicSetting' // 基础配置
// import Onecode from '@/view/brand/codegoods/thingslist' // 商品码管理
// import Things from '@/view/brand/codegoods/thingsedit' // 新增编辑物品
// import Batchs from '@/view/brand/codegoods/batchsedit' // 批次管理&&新增编辑批次
// import Thingsbatchs_detail from '@/view/brand/codegoods/thingsbatchsdetail' //物品批次详情
// import Withdraw from '@/view/mall/marketing/withdraw' // 提现申请
// import Surveillance from '@/view/mall/marketing/surveillance' // 店铺二维码
// import Distributorlog from '@/view/mall/marketing/logByDistributor' // 商家店铺记录
// import List from '@/view/mall/reservation/resourcesetting/list' // 资源位管理
// import registerRromotionsAdd from '@/view/member/promotions/distributorEdit'

import Selformelementsetting from '@/view/member/selfservice/formsettinglist' // 自助表单元素配置
import Selformtempsetting from '@/view/member/selfservice/formtemplatelist' // 自助表单模板配置
// import Physicalmeasurement_detail from '@/view/member/selfservice/userdaliyrecord'   // 用户体测详情报表
import Physicalmeasurement from '@/view/member/selfservice/templatepreview' // 用户体测列表和配置

/***********member tag category begin*************/
import Membertagcategory from '@/view/member/members/tagcategory.vue' // 用户体测列表和配置
/***********member tag category end*************/
/***********新的门店 begin*************/
import Distributorshops from '@/view/mall/marketing/shops/lists' // 店铺管理
import Distributorshops_editor from '@/view/mall/marketing/shops/edit' // 店铺管理
/***********新的门店 end*************/

import Registrationactivity from '@/view/member/selfservice/registrationactivity' // 报名活动管理
import Registrationactivity_editor from '@/view/member/selfservice/registrationactivityadd' // 报名活动管理
import Registrationrecord from '@/view/member/selfservice/registrationrecord' // 报名记录管理
import Registrationrecord_detail from '@/view/member/selfservice/registrationrecordetail' // 报名记录管理
import Registrationrecord_editor from '@/view/member/selfservice/regRecordUpload' //报名审核结果上传日志

import Specificcrowddiscount from '@/view/member/promotions/specificcrowd/specificcrowddiscount' //定向促销
import Specificcrowddiscount_detail from '@/view/member/promotions/specificcrowd/userdiscoutlog' //定向促销促销详情

import Weburlsetting from '@/view/base/setting/weburlsetting' //外部链接配置

// 隐藏路由
import Home from '@/view/home' // 主框架
import Layout from '@/view/layout' // 主结构
import Authloading from '@/view/authloading' // 绑定微信
import Shopwxshop_editor from '@/view/base/shop/editshop' // 添加修改门店
import Basearticle_editor from '@/view/base/article/editor' // 添加编辑文章
import Brandmaterial_editor from '@/view/brand/wechat/artical/new_artical' // 新增编辑图文消息
import Servicegoods_editor from '@/view/mall/goods/service/items/add' // 服务类商品添加编辑
import Goodsphysical_editor from '@/view/mall/goods/physical/add' // 实体类商品添加编辑
import Tradenormalorders_detail from '@/view/mall/trade/order/detail/index.vue' // 实体订单详情
import Tradenormalorders_process from '@/view/mall/trade/order/process' // 实体订单详情
import Tradecommunityorders_detail from '@/view/mall/trade/order/detail/index.vue' // 社区团购订单详情
import Tradecommunityorders_process from '@/view/mall/trade/order/process' // 社区团购订单详情
import Tradenormalshoporders_detail from '@/view/mall/trade/order/detail' // 自营订单详情
import Tradedrugorders_detail from '@/view/mall/trade/order/detail' // 药品需求单订单详情
import Marketingdistribution_orders_detail from '@/view/mall/trade/order/detail' // 店铺订单详情
import Tradeservice_detail from '@/view/mall/trade/order/detail' // 服务订单详情
import Shippingtemplates_editor from '@/view/mall/trade/shipping/add' // 添加编辑运费模板
import Mallreservation_editor from '@/view/mall/reservation/resourcesetting/add' // 资源位添加
import Coupongive_detail from '@/view/member/coupon/giveErrorLog' // 优惠券后台发放记录详情
import Chief_detail from '@/view/member/coupon/giveErrorLog' // 优惠券后台发放记录详情
import Aftersaleslist_detail from '@/view/mall/aftersales/detail' // 售后单详情
import Fapiaolist_detail from '@/view/mall/fapiao/detail' //发票编辑
import Member_detail from '@/view/member/members/detail' // 会员详情页
import Membermarketing_detail from '@/view/member/cardticket/detail' // 优惠券领取记录
import Membermarketing_editor from '@/view/member/cardticket/edit' // 添加编辑优惠券
import Marketingbargain_editor from '@/view/member/bargain/add' // 添加编辑微信助力
import Marketingactivity_templ from '@/view/member/activity/templ' // 自动化营销选择模版
import Marketingactivity_editor from '@/view/member/activity/add' // 新增编辑自动化营销
import Groupsindex_editor from '@/view/member/groups/add' // 新增编辑拼团活动
import Groupsindex_team from '@/view/member/groups/team' // 拼团活动数据
import Groupsindex_detail from '@/view/member/groups/teamDetail' // 拼团活动团详情
import Popularizelist_child from '@/view/popularize/children' // 推广员直属下级
import Popularizelist_detail from '@/view/popularize/brokerageLog' // 推广员佣金详情
import Marketingcommunity_detail from '@/view/member/promotions/community/points' // 社区积分
import Marketingcommunity_editor from '@/view/member/promotions/community/add' // 新增编辑社区
import Marketingcommunityactivity_editor from '@/view/member/promotions/community/activity/add' // 新增编辑活动
import Communityactivityorder_detail from '@/view/mall/trade/order/detail' // 社区活动订单详情
import Marketingseckill_editor from '@/view/member/promotions/seckill/add' // 新增编辑秒杀活动
import Limitedtimesale_editor from '@/view/member/promotions/limitedtimesale/add' // 新增编辑限时特惠活动
import Goodslimit_editor from '@/view/member/promotions/goodslimit/add' // 新增商品限购
import Memberpreference_editor from '@/view/member/promotions/memberpreference/add' // 新增会员优先购
import Editsourcemanagement_detail from '@/view/wxapp/statistics/sourcemanagement/monito_detail'
import Marketingsfulldiscount_editor from '@/view/member/promotions/fulldiscount/add' // 添加编辑满折活动
import Marketingsfullminus_editor from '@/view/member/promotions/fullminus/add' // 添加编辑满减活动
import Marketingsfullgift_editor from '@/view/member/promotions/fullgift/add' // 添加编辑满赠活动
import Marketingpackage_editor from '@/view/member/promotions/package/add' // 组合促销促销
import Wxapp_templ from '@/view/wxapp/template' // 开通小程序模板
import Templatelist from '@/view/pc/pctemplate' // 开通PC模板
import Marketingdeliveryorder_detail from '@/view/member/promotions/community/deliverydetail' // 配送单详情
import Marketingspluspricebuy_editor from '@/view/member/promotions/pluspricebuy/add' // 加价购活动编辑
import Shopexerp from '@/view/base/setting/shopexerp' // 商派erp直连配置
import Planting_editor from '@/view/base/planting/editor' // 添加编辑种草
import Admininfo from '@/view/base/shop/admininfo' // 管理员信息
import Yilianyun from '@/view/base/setting/yilianyun/index' // 管理员信息
import Tradesetting from '@/view/base/setting/tradesetting/index' // 管理员信息
import Meiqia from '@/view/base/setting/im/list' // 管理员信息
import Echat from '@/view/base/setting/im/echat' // 一洽配置信息
import Fapiaosetting from '@/view/base/setting/fapiao/list' // 发票配置
import AddressBook from '@/view/base/setting/addressBook/index' // 企业微信通讯录
import Pointrule from '@/view/member/point/index.vue' // 管理员信息
import Pointoverview from '@/view/member/point/overview.vue' // 积分总览

import Selformelementsetting_editor from '@/view/member/selfservice/formsettingadd' // 自助表单元素配置
import Selformtempsetting_editor from '@/view/member/selfservice/formtemplateadd' // 自助表单模板配置
import Physicalmeasurement_detail from '@/view/member/selfservice/userdaliyrecord' // 用户体测详情报表
import Couponsend_detail from '@/view/member/members/detail' // 群发优惠券会员详情页
import Shoppingguidenotification_editor from '@/view/guide/shoppingguidenotification_editor' // 导购员管理 编辑
import ShoppingGuideTask_editor from '@/view/guide/shoppingGuideTask_editor' // 新增编辑导购任务
import Shopactivities_editor from '@/view/guide/shopActivities_editor' // 导购知识库 编辑

// 店铺端页面
import Shopstorelist from '@/view/shop/storelist' // 门店列表
import Shopstorelist_editor from '@/view/shop/editstore' // 门店编辑
import Companygoods from '@/view/shop/goods/companygoods' // 门店编辑
import Memberstatistics from '@/view/mall/datacube/companydata/member' // 商城统计信息-会员
import Orderstatistics from '@/view/mall/datacube/companydata/order' // 商城统计信息-订单
import Distributordata from '@/view/mall/datacube/distributordata' // 商城统计信息-订单
import Hotkeywords from '@/view/mall/goods/hotkeywords' // 热门关键词
import Goodsstatistics from '@/view/mall/datacube/goodsdata' // 商品统计信息
import AccountingStatistics from '@/view/mall/datacube/accountingstatistics' // 分账统计
import AccountingStatistics_detail from '@/view/mall/datacube/accountingstatistics_detail' // 分账统计-查看
import CashRecord from '@/view/mall/datacube/cashrecord' // 提现统计

//import Logistics from '@/view/mall/trade/logistics'
import Logistics from '@/view/mall/trade/logistics/index.vue'
import Noticemessage from '@/view/wxapp/messages' // 查看oms通信日志

import Kdniao from '@/view/base/setting/kdniao' // 快递配置
import Sfbsp from '@/view/base/setting/sfbsp' // 快递配置

import Workwechat from '@/view/base/setting/workwechat/workwechat'
import Openapi from '@/view/base/setting/opendev/index' //开发接口配置
import DistributionConfig from '@/view/base/setting/distribution/index'
import Wxaindex from '@/view/base/wxa/index'
import Extminilink from '@/view/base/wxa/extMiniLink' // 小程序外链
import Extminilink_editor from '@/view/base/wxa/extMiniLinkDetail' // 小程序外链详情

import Profitlist from '@/view/mall/profit/list' // 交易单管理
import Publicsetting from '@/view/base/setting/publicsetting' //公共配置页面
import Sharesetting from '@/view/base/setting/sharesetting' //分享页面
import Liveroomlist from '@/view/mall/liveroom/list' // 直播间列表
import Liveroomlist_editor from '@/view/mall/liveroom/replay' //直播间视频回放列表

import Normalordersupload from '@/view/mall/trade/normalorders/ordersupload' // 实体订单导入列表

// 跨境
import Origincountry from '@/view/crossborder/origincountry/list' // 产地国
import Crossbordersetinfo from '@/view/crossborder/crossborderset/info' // 跨境设置
import Godsphysicalkj from '@/view/mall/goods/physical/list' // 实体类商品
import Godsphysicalkj_editor from '@/view/mall/goods/physical/add' // 实体类商品添加编辑
import Taxstrategy from '@/view/crossborder/taxstrategy/list' // 跨境税率策略列表
import Taxstrategy_editor from '@/view/crossborder/taxstrategy/edit' // 跨境税率策略详情

import Financialaftersaleslist from '@/view/mall/aftersales/financial/list' // 财务-售后列表
import Salesreportlist from '@/view/mall/trade/financial/list' // 财务-销售报表
import Whitelistlist from '@/view/member/whitelist/list' // 会员-白名单
import Whitelistuploade from '@/view/member/whitelist/uploadeindex' // 会员-白名单导入

import Shopmenu from '@/view/menus/shopmenu' // 商城菜单管理
import Distributormenu from '@/view/menus/distributormenu' // 店铺菜单管理

import Regionauth from '@/view/regionauth/list' // 地区权限

// 积分商城相关
import Pointsmallmaincategory from '@/view/mall/pointsmallgoods/maincategory' // 商品主类目
import Pointsmallcategory from '@/view/mall/pointsmallgoods/category' // 商品分类
import Pointsmallphysical from '@/view/mall/pointsmallgoods/physical/list' // 实体类商品
import Pointsmallphysical_editor from '@/view/mall/pointsmallgoods/physical/add' // 实体类商品添加编辑
import Pointsmallattributes from '@/view/mall/pointsmallgoods/attributes/attributes' // 商品规格列表
import Pointsmallparams from '@/view/mall/pointsmallgoods/attributes/params' // 商品参数列表
import Pointsmallbrand from '@/view/mall/pointsmallgoods/attributes/brand' // 商品品牌管理
import Pointsmallphysicalupload from '@/view/mall/pointsmallgoods/physical/normalGoodsUpload' // 实体商品导入
import Pointsmallphysicalstoreupload from '@/view/mall/pointsmallgoods/physical/normalGoodsStoreUpload' // 实体商品库存导入
// 设置
import Pointsmallsetting from '@/view/mall/pointsmallsetting/index' // 实体商品库存导入
import Templatesetting from '@/view/mall/templatesetting/index' // 实体商品库存导入

import Pointsmallenormalorders from '@/view/mall/pointsmalltrade/normalorders/list' // 实物订单管理
import Pointsmallenormalorders_detail from '@/view/mall/pointsmalltrade/order/detail' // 实体订单详情
import Pointsmallrate from '@/view/mall/pointsmalltrade/rate/list' // 积分订单评价

import Openscreenad from '@/view/base/screen/openScreenAD' // 开屏广告
// import AfterServiceReason from
import Aftersalesreason from '@/view/mall/aftersales/reason' // 售后原因

//大屏
import Shopscreen_category from '@/view/shopscreen/category' // 自定义大屏分类
import BigScreenAd from '@/view/shopscreen/bigScreenAd' // 大屏广告
import HomeCarousel from '@/view/shopscreen/homeCarousel' // 轮播广告
import SearchKeyWords from '@/view/shopscreen/searchKeyWords' // 关键词设置
// 分账
import Setting from '@/view/mall/splitbill/setting' // 分账设置
import StoreFenSetting from '@/view/mall/splitbill/storesetting' // 分账设置

import StoreInformation from '@/view/mall/splitbill/list' // 分账进件列表

import StoreInformation_editor from '@/view/mall/splitbill/edit' // 店铺认证信息录入
import StoreAccountingStatistics from '@/view/mall/splitbill/storeAccount' // 店铺分账统计
import PlatformAccountingStatistics from '@/view/mall/splitbill/platformAccount' // 平台分账统计

import Pointupvaluation from '@/view/member/promotions/pointupvaluation/list' // 积分升值活动管理
import Pointupvaluation_editor from '@/view/member/promotions/pointupvaluation/add' // 新增编辑积分升值活动

import Extrapoint from '@/view/member/promotions/extrapoint/list' //额外积分活动列表
import Extrapoint_templ from '@/view/member/promotions/extrapoint/templ' // 额外积分活动选择模版
import Extrapoint_editor from '@/view/member/promotions/extrapoint/editor' //额外积分编辑页面

// 同城配
import Dada from '@/view/mall/distribution/account' // 达达账户余额

// 万宁-店铺-店铺商品更新
import Exportstoreitems from '@/view/mall/marketing/productUpdate'
// 万宁-店铺-店铺交易统计
import TransactionStatistics from '@/view/mall/marketing/transactionStatistics'

export default {
  Home,
  Domain_setting,
  Wxaindex,
  Layout,
  Authloading,
  Dashboard,
  Shopwxshop_editor,
  Shopwxshop,
  Wxshopsetting,
  Comments,
  Assetpayment,
  Assetaccountactivation,
  Datamessage,
  Staffleader,
  Accountmanagement,
  Accountroles,
  Basearticle,
  Basearticle_editor,
  Basecurrency,
  Baseexport,
  Brand,
  Brandcustomer,
  Brandmenu,
  Brandreply,
  Brandfans,
  Brandmaterial,
  Brandmaterial_editor,
  Goodscategory,
  Goodsmaincategory,
  Servicegoods,
  Servicegoods_editor,
  Goodsphysical,
  Goodsphysical_editor,
  Goodsaudit,
  Goodsaudit_editor,
  Physicalupload,
  Physicalstoreupload,
  Itemstagupload,
  Physicalprofitupload,
  Goodsbrand,
  Arrivalnotice,
  Servicepayment,
  Tradeservice,
  Tradenormalorders,
  Tradenormalshoporders,
  Tradecommunityorders,
  Tradedrugorders,
  Tradepayment,
  Tradeverification,
  Tradenormalorders_detail,
  Tradenormalorders_process,
  Tradenormalshoporders_detail,
  Tradecommunityorders_process,
  Tradecommunityorders_detail,
  Tradedrugorders_detail,
  Tradeservice_detail,
  Shippingtemplates,
  Shippingtemplates_editor,
  Marketingdistributor,
  Marketingdistributor_editor,
  Marketingdistributor_template,
  Marketingdistribution_orders,
  Marketingdistribution_orders_detail,
  Marketingdistributor_wxpaysetting,
  Distributortags,
  Distributorrel_items,
  Distributoraftersalesaddress,
  Distributorinvoice,
  Marketinglog,
  ShopDecoration,
  Marketingsalesman,
  Marketingsalesmanrole,
  ShoppingGuideTask,
  ShoppingGuideTask_statistics,
  Shoppingguidenotification,
  Shopnoticetempl,
  Salemancustomercomplaints,
  SalemanLoginHistory,
  Reservationsetting,
  Mallreservation,
  Mallreservation_editor,
  Reservationorder,
  Mallrecharge,
  Aftersaleslist,
  Aftersaleslist_detail,
  Aftersalesrefundlist,
  Aftersalesrefundlist_detail,
  Fapiaolist,
  Fapiaolist_detail,
  Fapiao_set,
  Fapiao_set_detail,
  Member,
  Member_detail,
  Manageinfomation,
  Managecard,
  Managecardorder,
  Managecustomer,
  Trustlogin,
  Managetag,
  Analysisrights,
  AnalysisrightsContent,
  Membermarketing,
  Couponsend,
  Couponsend_detail,
  Smssend,
  Coupongive,
  Coupongive_detail,
  Chief,
  Chief_detail,
  Coupongrantset,
  Membermarketing_detail,
  Marketingindex,
  // registerRromotionsAdd,
  Membermarketing_editor,
  Marketingbargain_editor,
  Marketingbargain,
  Marketingactivity,
  Marketingactivity_templ,
  Marketingactivity_editor,
  Goodslimit,
  Goodslimit_editor,
  Memberpreference,
  Memberpreference_editor,
  Groupsindex,
  Groupsindex_editor,
  Groupsindex_detail,
  Groupsindex_team,
  Popularizesetting,
  Promotersetting,
  Popularizelist,
  Popularizedata,
  Popularizelist_child,
  Popularizewithdraw,
  Popularizegoods,
  PopularizegoodsAudit,
  Taskbrokerage,
  Taskbrokeragecount,
  Popularizelist_detail,
  Marketingcommunity,
  Marketingcommunity_detail,
  Marketingcommunity_editor,
  Marketingcommunityactivity,
  Marketingcommunityactivity_editor,
  Marketingdeliveryorder,
  Marketingdeliveryorder_detail,
  Communitysetting,
  Communitywithdraw,
  Communityactivityorder,
  Communityactivityorder_detail,
  Marketingseckill,
  Marketingseckill_editor,
  Limitedtimesale,
  Limitedtimesale_editor,
  Wxapp,
  Wxapp_templ,
  Templatelist,
  Templateedit,
  Batemplateedit,
  Editcategory,
  Floorguide,
  Colorstyle,
  Cartremind,
  Membercentersetting,
  Custompage,
  Salespersonshelfindex,
  Editdashboard,
  Editsourcemanagement,
  Editsourcemanagement_detail,
  Editauthorize,
  Marketingsfulldiscount,
  Marketingsfulldiscount_editor,
  Marketingpackage,
  Marketingpackage_editor,
  Marketingsfullminus,
  Marketingsfullminus_editor,
  Marketingsfullgift,
  Marketingsfullgift_editor,
  Marketingspluspricebuy,
  Marketingspluspricebuy_editor,
  Wheel,
  Shopactivities,
  Shopactivities_editor,
  ShoppingGuideTask_editor,
  Shoppingguidenotification_editor,
  Ordersetting,
  Pctemplate,
  Pcviptemplate,
  Pcfootertext,
  Tdkglobalset,
  Tdkgivenset,
  Pccustompage,
  Shopexerp,
  Goodsattributes,
  Goodsparams,
  Storeshopitemanagement,
  Merchantstaff,
  Merchantstaffroles,
  Platformstaff,
  Platformstaffroles,
  Planting,
  Planting_editor,
  Articlecolumns,
  Articlegeneralcolumns,
  Itemtags,
  Selfdeliveryaddress,
  // Distributoraftersalesaddress,
  Admininfo,
  Recommendlike,
  Omsqueuelog,
  Yilianyun,
  Tradesetting,
  Meiqia,
  Echat,
  Fapiaosetting,
  DistributorCode,
  // Onecode,
  // Things,
  // Batchs,
  // Thingsbatchsdetail,
  // Basic_setting,
  // Withdraw,
  // Surveillance,
  // Log,
  // Distributorlog,
  // List,
  Selformelementsetting,
  Selformelementsetting_editor,
  Selformtempsetting,
  Selformtempsetting_editor,
  Shopstorelist,
  Shopstorelist_editor,
  Companygoods,
  Memberstatistics,
  Orderstatistics,
  Hotkeywords,
  Goodsstatistics,
  AccountingStatistics,
  AccountingStatistics_detail,
  Operatorlogs,
  Logistics,

  Refunderrorlogs,
  Distributordata,
  CashRecord,
  Pointrule,
  Pointoverview,
  Noticemessage,
  Kdniao,
  Sfbsp,
  Rate,
  Physicalmeasurement,
  Physicalmeasurement_detail,
  Membertagcategory,
  Distributorshops,
  Distributorshops_editor,
  Workwechat,
  Openapi,
  DistributionConfig,
  SalesmanRelationship,
  Certificate,
  Registrationactivity,
  Registrationactivity_editor,
  Registrationrecord,
  Registrationrecord_detail,
  Registrationrecord_editor,
  Profitlist,
  Specificcrowddiscount,
  Specificcrowddiscount_detail,
  Weburlsetting,
  Publicsetting,
  Sharesetting,
  Liveroomlist,
  Liveroomlist_editor,
  Normalordersupload,
  AddressBook,
  // 跨境
  Origincountry,
  Crossbordersetinfo,
  Godsphysicalkj,
  Godsphysicalkj_editor,
  Taxstrategy,
  Taxstrategy_editor,
  DataAnalysis,
  Financialaftersaleslist,
  Salesreportlist,
  Whitelistlist,
  Whitelistuploade,
  // 小程序外链
  Extminilink,
  Extminilink_editor,
  //商城菜单管理
  Shopmenu,
  //店铺菜单管理
  Distributormenu,
  // 地区权限
  Regionauth,
  // 积分商城相关
  Pointsmallmaincategory,
  Pointsmallcategory,
  Pointsmallphysical,
  Pointsmallphysical_editor,
  Pointsmallattributes,
  Pointsmallparams,
  Pointsmallbrand,
  Pointsmallphysicalupload,
  Pointsmallphysicalstoreupload,
  Pointsmallsetting,
  Templatesetting,
  Pointsmallenormalorders,
  Pointsmallenormalorders_detail,
  Pointsmallrate,
  // 开屏广告
  Openscreenad,
  Aftersalesreason,
  // 大屏
  Shopscreen_category,
  BigScreenAd,
  HomeCarousel,
  SearchKeyWords,
  Setting,
  StoreInformation,
  StoreInformation_editor,
  StoreFenSetting,
  StoreAccountingStatistics,
  PlatformAccountingStatistics,
  Pointupvaluation,
  Pointupvaluation_editor,
  Extrapoint,
  Extrapoint_templ,
  Extrapoint_editor,
  GoodsShareSetting,
  // 达达账户余额
  Dada,
  // 万宁-店铺-店铺商品更新
  Exportstoreitems,

  // 万宁-店铺-店铺交易统计
  TransactionStatistics,
  Wxappmanage
}

// 如果路由通过页面传值那么需要定义当前值的字段名称
export let routesParamsKey = {
  Shopstorelist_editor: 'wxShopId',
  Goodsphysical_editor: 'itemId',
  Godsphysicalkj_editor: 'itemId',
  Basearticle_editor: 'wxShopId',
  Brandmaterial_editor: 'media_id',
  Servicegoods_editor: 'itemId',
  Shippingtemplates_editor: 'templatesId',
  Marketingbargain_editor: 'bargain_id',
  Marketingactivity_editor: 'type',
  Groupsindex_editor: 'groups_id',
  Groupsindex_detail: 'team_id',
  Groupsindex_team: 'groups_id',
  Marketingcommunity_editor: 'community_id',
  Marketingcommunityactivity_editor: 'activity_id',
  Marketingseckill_editor: 'seckill_id',
  Limitedtimesale_editor: 'seckill_id',
  Marketingdeliveryorder_detail: 'delivery_id',
  Marketingsfulldiscount_editor: 'marketing_id',
  Marketingsfullminus_editor: 'marketing_id',
  Marketingsfullgift_editor: 'marketing_id',
  Marketingspluspricebuy_editor: 'marketing_id',
  Planting_editor: 'marketing_id',
  Shopwxshop_editor: 'wxShopId',
  Marketingpackage_editor: 'package_id',
  Goodslimit_editor: 'limit_id',
  Memberpreference_editor: 'marketing_id',
  ShopActivities_editor: 'item_id',
  ShoppingGuideTask_editor: 'task_id',
  Shoppingguidenotification_editor: 'id',
  Pointsmallphysical_editor: 'itemId',
  Taxstrategy_editor: 'id',
  StoreInformation_editor: 'id',
  Extrapoint_editor: 'id',
  Extminilink_editor: 'id'
}
