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

import banner from './banner/index'
import bannerStyle from './banner/style'
import goodsGrid from './goodsGrid/index'
import goodsGridStyle from './goodsGrid/style'
import panel from './panel/index'
import panelStyle from './panel/style'
import imgHotzone from './imgHotzone/index'
import imgHotzoneStyle from './imgHotzone/style'
import floor from './floor/index'
import floorStyle from './floor/style'
// import nav from './nav/index'
import navStyle from './nav/style'
import settingsStyle from './settings/style'
export default {
  [banner.name]: { widget: banner, style: 'bannerStyle' },
  [bannerStyle.name]: { widget: bannerStyle },
  [goodsGrid.name]: { widget: goodsGrid, style: 'goodsGridStyle' },
  [goodsGridStyle.name]: { widget: goodsGridStyle },
  [panel.name]: { widget: panel, style: 'panelStyle' },
  [panelStyle.name]: { widget: panelStyle },
  [imgHotzone.name]: { widget: imgHotzone, style: 'imgHotzoneStyle' },
  [imgHotzoneStyle.name]: { widget: imgHotzoneStyle },
  [floor.name]: { widget: floor, style: 'floorStyle' },
  [floorStyle.name]: { widget: floorStyle },
  // [nav.name]: { widget: nav, style: 'navStyle' },
  [navStyle.name]: { widget: navStyle },
  [settingsStyle.name]: { widget: settingsStyle }
}
