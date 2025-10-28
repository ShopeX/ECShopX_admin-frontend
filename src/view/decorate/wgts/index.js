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

import { VERSION_PLATFORM } from '@/utils'
import WgtSlider from './wgt_slider'
import WgtGoodsGrid from './wgt_goodsGrid'
import WgtHotZone from './wgt_hotzone'
import WgtFilm from './wgt_film'
import WgtCoupon from './wgt_coupon'
import WgtShowCase from './wgt_showcase'
import WgtGoodsGridTab from './wgt_goodsGridTab'
import WgtStore from './wgt_store'
import WgtSearch from './wgt_search'
import WgtHeadline from './wgt_headline'
import WgtHotTopic from './wgt_hotTopic'
import WgtGoodsScroll from './wgt_goodsScroll'
import WgtMarquees from './wgt_marquees'
import WgtFloorImg from './wgt_floorImg'
import WgtNearbyShop from './wgt_nearbyShop'
import WgtImageNavigation from './wgt_imgNavigation'
import WgtGoodsCard from './wgt_goodsCard'
import WgtWriting from './wgt_writing'
import WgtHeading from './wgt_heading'
import WgtFullSlider from './wgt_fullSlider'
import wgtOrderNavigation from './wgt_orderNavigation'

// 首页装修
let SCENE_1001 = {
  WgtSlider,
  WgtGoodsGrid,
  WgtHotZone,
  WgtFilm,
  WgtCoupon,
  WgtShowCase,
  WgtGoodsGridTab,
  WgtSearch,
  WgtHeadline,
  WgtHotTopic,
  WgtGoodsScroll,
  WgtMarquees,
  WgtFloorImg,
  WgtImageNavigation,
  WgtFullSlider,
  wgtOrderNavigation
}

if (VERSION_PLATFORM()) {
  SCENE_1001 = {
    ...SCENE_1001,
    WgtStore,
    WgtNearbyShop
  }
}

// 商品详情
const SCENE_1002 = {
  WgtSlider,
  WgtFilm,
  WgtHeadline,
  WgtHotZone
}

// 店铺装修
const SCENE_1003 = {
  WgtSlider,
  WgtGoodsGrid,
  WgtHotZone,
  WgtFilm,
  WgtCoupon,
  WgtShowCase,
  WgtGoodsGridTab,
  WgtSearch,
  WgtHeadline,
  WgtHotTopic,
  WgtGoodsScroll,
  WgtMarquees,
  WgtFloorImg,
  WgtImageNavigation,
  WgtStore,
  WgtNearbyShop
}

// 自定义页面装修
const SCENE_1004 = SCENE_1001

// 软文
const SCENE_1005 = {
  WgtSlider,
  WgtFilm,
  WgtGoodsCard,
  WgtWriting,
  WgtHeading
}

// ibs导航
const SCENE_1006 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtCoupon,
  WgtShowCase,
  WgtSearch,
  WgtHeadline
}

// 个人中心
const SCENE_1008 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtMarquees,
  wgtOrderNavigation
}

const SCENE_1009 = {
  WgtSearch,
  WgtSlider,
  WgtHotZone,
  WgtGoodsGrid
}

export default {
  1001: SCENE_1001,
  1002: SCENE_1002,
  1003: SCENE_1003,
  1004: SCENE_1004,
  1005: SCENE_1005,
  1006: SCENE_1006,
  1008: SCENE_1008,
  1009: SCENE_1009
}
