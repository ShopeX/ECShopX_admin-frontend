import { VERSION_PLATFORM } from '@/utils'
import WgtSlider from './wgt_slider' //轮播图
import WgtHotZone from './wgt_hotzone' //热门专区
import WgtFilm from './wgt_film' //视频
// import WgtCoupon from './wgt_coupon' //优惠券
// import WgtGoodsGrid from './wgt_goodsGrid' //商品TAB
// import WgtShowCase from './wgt_showcase' // 橱窗
// import WgtGoodsGridTab from './wgt_goodsGridTab' //商品TAB
// import WgtStore from './wgt_store' //  推荐店铺
import WgtShop from './wgt_shop' //店铺
// import WgtSearch from './wgt_search' //搜索
// import WgtHeadline from './wgt_headline' //标题
// import WgtHotTopic from './wgt_hotTopic' //热门话题
// import WgtGoodsScroll from './wgt_goodsScroll'
import WgtMarquees from './wgt_marquees' //文本轮播
// import WgtFloorImg from './wgt_floorImg' //楼层图片
// import WgtNearbyShop from './wgt_nearbyShop' //附近店铺
// import WgtImageNavigation from './wgt_imgNavigation'//图片导航
import WgtContentPart from './wgt_contentpart' //内容分区
import WgtClassify from './wgt_classify' //分类
import WgtShelves from './wgt_shelves' //货架
import WgtSignIn from './wgt_signIn' //签到
import WgtTask from './wgt_task' //任务
import WgtCouponCard from './wtg_couponcard' //优惠券
// 首页装修
let SCENE_1001 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtContentPart,
  WgtMarquees,
  WgtShop,
  WgtShelves,
  WgtCouponCard,
  WgtClassify,
  // WgtSignIn,
  // WgtTask,
}

// if (VERSION_PLATFORM) {
//   SCENE_1001 = {
//     ...SCENE_1001,
//     WgtShop,
//     // WgtNearbyShop,
//     WgtContentPart
//   }
// }

// 商品详情
const SCENE_1002 = {
  WgtSlider,
  WgtFilm,
  // WgtHeadline
}

// 店铺装修
const SCENE_1003 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtContentPart,
  WgtMarquees,
  WgtShelves,
  WgtCouponCard,
  WgtClassify,
}

// 自定义页面装修
const SCENE_1004 = SCENE_1001

// 软文
const SCENE_1005 = {
  WgtSlider
}

// ibs导航
const SCENE_1006 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  // WgtCoupon,
  WgtCouponCard,
  // WgtShowCase,
  // WgtSearch,
  // WgtHeadline,
  WgtContentPart
}

// 分类页面
const SCENE_1007 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtShop,
  WgtClassify
}

// 个人中心
const SCENE_1008 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtMarquees,
}

export default {
  1001: SCENE_1001,
  1002: SCENE_1002,
  1003: SCENE_1003,
  1004: SCENE_1004,
  1006: SCENE_1006,
  1007: SCENE_1007,
  1008: SCENE_1008
}
