import WgtSlider from './wgt_slider'
import WgtGoodsGrid from './wgt_goodsGrid'
import WgtHotZone from './wgt_hotzone'
import WgtFilm from './wgt_film'
import WgtCoupon from './wgt_coupon'
import WgtShowCase from './wgt_showcase'
import WgtGoodsGridTab from './wgt_goodsGridTab'
import WgtStore from './wgt_store'
import WgtSearch from './wgt_search'
// import wgtHeadline from './wgt_headline'
import wgtHotTopic from './wgt_hotTopic'
import wgtGoodsScroll from './wgt_goodsScroll'
import WgtMarquees from './wgt_marquees'
import WgtFloorImg from './wgt_floorImg'
import WgtNearbyShop from './wgt_nearbyShop'

// 首页装修
const SCENE_1001 = {
  WgtSlider,
  WgtGoodsGrid,
  WgtHotZone,
  WgtFilm,
  WgtCoupon,
  WgtShowCase,
  WgtGoodsGridTab,
  WgtStore,
  WgtSearch,
  // wgtHeadline,
  wgtHotTopic,
  wgtGoodsScroll,
  WgtMarquees,
  WgtFloorImg
}

// 商品详情
const SCENE_1002 = {
  WgtSlider
}

// 店铺装修
const SCENE_1003 = {
  WgtSlider
}

// 软文
const SCENE_1004 = {
  WgtSlider
}

export default {
  1001: SCENE_1001,
  1002: SCENE_1002
}
