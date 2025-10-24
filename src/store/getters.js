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

const getters = {
  token: (state) => state.user.token,
  versionMode: (state) => state.system.versionMode,

  exp: (state) => state.user.exp,
  name: (state) => state.user.name,
  nick_name: (state) => state.user.nick_name,
  avatar: (state) => state.user.avatar,
  is_authorizer: (state) => state.user.is_authorizer,
  license_authorize: (state) => state.user.license_authorize,
  wxapp_id: (state) => state.user.wxapp_id,
  template_name: (state) => state.user.template_name,
  login_type: (state) => state.user.login_type,
  login_from: (state) => state.user.login_from,
  shopId: (state) => state.user.shopid,
  isInFrame: (state) => state.user.isInFrame,
  productionCode: (state) => state.user.product_code,
  isMicorMall: (state) => state.user.product_code == 'PD_0017',
  ali_appid: (state) => state.user.ali_appid,
  ali_template_name: (state) => state.user.ali_template_name,
  app_type: (state) => state.user.app_type,
  color_theme: (state) => state.user.color_theme,
  readLicense: (state) => state.user.readLicense
}
export default getters
