const getters = {
  token: state => state.user.token,
  exp: state => state.user.exp,
  name: state => state.user.name,
  nick_name: state => state.user.nick_name,
  avatar: state => state.user.avatar,
  is_authorizer: state => state.user.is_authorizer,
  license_authorize: state => state.user.license_authorize,
  wxapp_id: state => state.user.wxapp_id,
  template_name: state => state.user.template_name,
  login_type: state => state.user.login_type,
  shopId:state => state.user.shopid,
  isInFrame:state=>state.user.isInFrame,
  productionCode: state => state.user.product_code,
  isMicorMall: state => state.user.product_code == 'PD_0017',
  ali_appid: state => state.user.ali_appid,
  ali_template_name: state => state.user.ali_template_name,
  app_type: state => state.user.app_type,
  color_theme: state => state.user.color_theme
}
export default getters
