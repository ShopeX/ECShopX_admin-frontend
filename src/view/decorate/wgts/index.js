/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { VERSION_PLATFORM, VERSION_STANDARD } from '@/utils'
import WgtSlider from './wgt_slider'
import WgtHotZone from './wgt_hotzone'
import WgtFilm from './wgt_film'
import WgtCoupon from './wgt_coupon'
import WgtShop from './wgt_shop'
import WgtMarquees from './wgt_marquees'
import WgtNearbyShop from './wgt_nearbyShop'
import WgtGoodsCard from './wgt_goodsCard'
import WgtWriting from './wgt_writing'
import WgtHeading from './wgt_heading'
import WgtFullSlider from './wgt_fullSlider'
import wgtOrderNavigation from './wgt_orderNavigation'
import WgtStoreAlphabet from './wgt_store-alphabet'
import WgtClassify from './wgt_classify'
// import WgtShelves from './wgt_shelves'
import WgtLocationModule from './wgt_locationModule'
import WgtContentPartition from './wgt_contentPartition'
// import WgtSpeedkill from './wgt_speedkill' // 秒杀 - 已注释
// import WgtGroup from './wgt_group' // 拼团 - 已注释
// import WgtRanking from './wgt_ranking' // 品类榜单 - 已注释
import WgtHotRanking from './wgt_hotranking'
import WgtGoods from './wgt_goods'
console.log('VERSION_STANDARD', VERSION_STANDARD())

// 首页装修
let SCENE_1001 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtCoupon,
  WgtMarquees,
  WgtFullSlider,
  WgtClassify,
  WgtLocationModule,
  WgtContentPartition,
  // WgtSpeedkill, // 秒杀 - 已注释
  // WgtGroup, // 拼团 - 已注释
  // WgtRanking, // 品类榜单 - 已注释
  WgtHotRanking,
  WgtGoods
}

// 店铺挂件仅 BBC 展示，B2C 不展示
if (VERSION_PLATFORM()) {
  SCENE_1001 = {
    ...SCENE_1001,
    WgtShop
  }
}

// 商品详情
const SCENE_1002 = {
  WgtSlider,
  WgtFilm,
  WgtHotZone
}

// 店铺装修（店铺挂件仅 BBC 展示）
const SCENE_1003 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtCoupon,
  WgtMarquees,
  WgtFullSlider,
  WgtClassify,
  WgtLocationModule,
  WgtContentPartition,
  WgtHotRanking,
  WgtGoods,
  ...(!VERSION_STANDARD() ? { WgtShop } : {})
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
  WgtCoupon
}

// 个人中心
const SCENE_1008 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  WgtMarquees,
  wgtOrderNavigation,
  WgtGoods
}

// 分类页面（storeAlphabet 仅在此页可用；店铺挂件仅 BBC 展示）
const SCENE_1007 = {
  WgtSlider,
  WgtHotZone,
  WgtFilm,
  ...(!VERSION_STANDARD() ? { WgtShop } : {}),
  WgtStoreAlphabet,
  WgtClassify,
  WgtGoods
  // WgtTask
}

const SCENE_1009 = {
  WgtSlider,
  WgtHotZone
}

export default {
  1001: SCENE_1001,
  1002: SCENE_1002,
  1003: SCENE_1003,
  1004: SCENE_1004,
  1005: SCENE_1005,
  1006: SCENE_1006,
  1007: SCENE_1007,
  1008: SCENE_1008,
  1009: SCENE_1009
}
