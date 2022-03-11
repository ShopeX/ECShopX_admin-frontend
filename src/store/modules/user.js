import { getUserInfo } from '@/api/auth'

const user = {
  state: {
    token: '',
    exp: '',
    name: '',
    is_authorizer: false,
    license_authorize: '',
    route_app: '',
    wxapp_id: '',
    template_name: 'yykweishop',
    login_type: '',
    nick_name: '',
    avatar: '',
    shopid: '',
    isInFrame: false,
    product_code: '',
    ali_appid: '',
    ali_template_name: '',
    app_type: '',
    color_theme: ''
  },

  mutations: {
    SET_TOKEN (state, { token }) {
      const tokenArray = token.split('.')
      const user = JSON.parse(atob(tokenArray[1]))
      console.log('userInfo: ', user)
      state.token = token
      state.exp = user.exp
      state.mobile = user.mobile
      state.is_authorizer = user.is_authorizer
      state.license_authorize = user.license_authorize
    },
    SET_TOKEN_EXP (state, { exp }) {
      state.exp = exp
    },
    CLEAR_TOKEN (state) {
      state.token = ''
      state.exp = ''
    },
    SET_USERINFO (state, payload) {
      const { username, head_portrait } = payload
      state.nick_name = username
      state.avatar = head_portrait
    },
    SYSTEM_EXIT (state, payload) {
      state.token = ''
      state.exp = ''
      state.name = ''
      ;(state.is_authorizer = false), (state.license_authorize = '')
    },
    SET_LOGIN_TYPE: (state, payload) => {
      const { loginType } = payload
      state.login_type = loginType
    },
    SET_PRODUCTION_CODE: (state, payload) => {
      const { productionCode } = payload
      state.product_code = productionCode
    },
    setUserInfo (state, payload) {
      const { username, head_portrait } = payload
      state.userInfo = {
        nick_name: username,
        avatar: head_portrait
      }
    },
    setShopId: (state, id) => {
      state.shopid = id
    },
    setUserName: (state, name) => {
      state.name = name
    },
    setNickName: (state, nickName) => {
      state.nick_name = nickName
    },
    setAvatar: (state, avatar) => {
      state.avatar = avatar
    },
    setAuthorizer: (state, isAuthorizer) => {
      state.is_authorizerr = isAuthorizer
    },
    setLicenseAuthorize: (state, isLicenseValid) => {
      state.license_authorize = isLicenseValid
    },
    setWxappId: (state, wxappId) => {
      state.wxapp_id = wxappId
    },
    setLoginType: (state, loginType) => {
      state.login_type = loginType
    },
    setCompanyType: (state, companyType) => {
      state.company_type = companyType
    },
    setTemplateName: (state, templateName) => {
      state.template_name = templateName
    },
    setIsFrame: (state, isInFrame) => {
      state.isInFrame = isInFrame
    },
    setALiTemplateName: (state, templateName) => {
      state.ali_template_name = templateName
    },
    setALiAppid: (state, ali_appid) => {
      state.ali_appid = ali_appid
    },
    setAppType: (state, app_type) => {
      state.app_type = app_type
    },
    setThemeColor: (state, color_theme) => {
      state.color_theme = color_theme
    }
  },

  actions: {
    setIsFrame ({ commit }, isInFrame) {
      commit('setIsFrame', isInFrame)
    },
    setAuthorizer ({ commit }, is_authorizer) {
      commit('setAuthorizer', is_authorizer)
    },

    setLicenseAuthorize ({ commit }, license_authorize) {
      commit('setLicenseAuthorize', license_authorize)
    },
    // 保存token
    setToken ({ commit }, token) {
      commit('setToken', token)
      // 解析token中的user信息，并且保存
      let tokenArray = token.split('.')
      let user = atob(tokenArray[1])
      user = JSON.parse(user)
      commit('setTokenExp', user.exp)
      commit('setUserName', user.mobile)
      commit('setAuthorizer', user.is_authorizer)
      commit('setLicenseAuthorize', user.license_authorize)
    },
    // 删除token
    unsetToken ({ commit }, token) {
      commit('setToken', '')
      commit('setTokenExp', '')
      commit('setUserName', '')
      commit('setAuthorizer', '')
      commit('setLicenseAuthorize', '')
    },
    setUser ({ commit }, userInfo) {
      commit('setNickName', userInfo.username)
      commit('setAvatar', userInfo.head_portrait)
    },
    setWxappId ({ commit }, wxapp_id) {
      commit('setWxappId', wxapp_id)
      commit('setALiAppid', '')
    },

    setTemplateName ({ commit }, template_name) {
      commit('setTemplateName', template_name)
      commit('setALiTemplateName', '')
    },
    setLoginType ({ commit }, login_type) {
      commit('setLoginType', login_type)
    },
    setShopId ({ commit }, id) {
      commit('setShopId', id)
    },
    setALiTemplateName ({ commit }, template_name) {
      commit('setALiTemplateName', template_name)
      commit('setTemplateName', '')
    },
    setALiAppid ({ commit }, ali_appid) {
      commit('setALiAppid', ali_appid)
      commit('setWxappId', '')
    },
    setAppType ({ commit }, app_type) {
      commit('setAppType', app_type)
    },
    setThemeColor: ({ commit }, color_theme) => {
      commit('setThemeColor', color_theme)
    }
  }
}

export default user
