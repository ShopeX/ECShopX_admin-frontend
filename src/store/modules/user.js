import api from '@/api'

const userStore = {
  namespaced: true,
  state: {
    accountInfo: null,
    accessMenus: [],
    login_type: '',
    shopid: '',
    token: '',

    //TODO: 以下删除?
    exp: '',
    name: '',
    is_authorizer: false,
    license_authorize: '',
    route_app: '',
    wxapp_id: '',
    template_name: 'yykweishop',
    login_type: '',
    login_from: '',
    nick_name: '',
    avatar: '',
    isInFrame: false,
    product_code: '',
    ali_appid: '',
    ali_template_name: '',
    app_type: '',
    color_theme: '',
    // versionMode: 'platform',
    readLicense: 0
  },

  mutations: {
    setToken(state, { token }) {
      state.token = token
    },
    // 设置菜单
    setAccessMenus(state, { accessMenus }) {
      state.accessMenus = accessMenus
    },
    // 设置帐户信息
    setAccountInfo(state, { accountInfo }) {
      state.accountInfo = accountInfo
    },
    logout(state) {
      state.accountInfo = null
      state.accessMenus = []
      state.login_type = ''
      state.shopid = ''
      state.token = ''
    },
    setShopId(state, { shopId }) {
      state.shopid = shopId
    },
    setLoginType: (state, { login_type }) => {
      state.login_type = login_type
    },

    CLEAR_TOKEN(state) {
      state.token = ''
      state.exp = ''
    },
    SET_USERINFO(state, payload) {
      const { username, head_portrait } = payload
      state.nick_name = username
      state.avatar = head_portrait
    },
    SYSTEM_EXIT(state, payload) {
      state.token = ''
      state.exp = ''
      state.name = ''
      state.is_authorizer = false
      state.license_authorize = ''
      state.route_app = ''
      state.wxapp_id = ''
      state.template_name = 'yykweishop'
      state.login_type = ''
      state.nick_name = ''
      state.avatar = ''
      state.shopid = ''
      state.isInFrame = false
      state.product_code = ''
      state.ali_appid = ''
      state.ali_template_name = ''
      state.app_type = ''
      state.color_theme = ''
      state.versionMode = 'platform'
    },
    SET_LOGIN_TYPE: (state, payload) => {
      const { loginType } = payload
      state.login_type = loginType
    },
    SET_LOGIN_FROM: (state, payload) => {
      const { loginFrom } = payload
      state.login_from = loginFrom
    },
    SET_PRODUCTION_CODE: (state, payload) => {
      const { productionCode } = payload
      state.product_code = productionCode
    },
    SET_VERSION_MODE: (state, payload) => {
      state.versionMode = payload
    },
    SET_READ_LICENSE: (state, payload) => {
      state.readLicense = payload
    },

    setUserInfo(state, payload) {
      const { username, head_portrait } = payload
      state.userInfo = {
        nick_name: username,
        avatar: head_portrait
      }
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

    setLoginFrom: (state, login_from) => {
      state.login_from = login_from
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
    async fetchAccessMenus({ commit }) {
      const accessMenus = await api.auth.getPermission()
      commit('setAccessMenus', { accessMenus })
      return accessMenus
    },
    async fetchAccountInfo({ commit }) {
      const accountInfo = await api.login.getAdminInfo()
      commit('setAccountInfo', { accountInfo })
    },
    // 删除token
    async unsetToken({ commit }, token) {
      commit('setToken', '')
      commit('setTokenExp', '')
      commit('setUserName', '')
      commit('setAuthorizer', '')
      commit('setLicenseAuthorize', '')
    },
    setIsFrame({ commit }, isInFrame) {
      commit('setIsFrame', isInFrame)
    },
    setAuthorizer({ commit }, is_authorizer) {
      commit('setAuthorizer', is_authorizer)
    },

    setLicenseAuthorize({ commit }, license_authorize) {
      commit('setLicenseAuthorize', license_authorize)
    },
    // 保存token
    setToken({ commit }, token) {
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

    setUser({ commit }, userInfo) {
      commit('setNickName', userInfo.username)
      commit('setAvatar', userInfo.head_portrait)
    },
    setWxappId({ commit }, wxapp_id) {
      commit('setWxappId', wxapp_id)
      commit('setALiAppid', '')
    },

    setTemplateName({ commit }, template_name) {
      commit('setTemplateName', template_name)
      commit('setALiTemplateName', '')
    },
    setLoginFrom({ commit }, login_from) {
      commit('setLoginFrom', login_from)
    },
    setShopId({ commit }, id) {
      commit('setShopId', id)
    },
    setALiTemplateName({ commit }, template_name) {
      commit('setALiTemplateName', template_name)
      commit('setTemplateName', '')
    },
    setALiAppid({ commit }, ali_appid) {
      commit('setALiAppid', ali_appid)
      commit('setWxappId', '')
    },
    setAppType({ commit }, app_type) {
      commit('setAppType', app_type)
    },
    setThemeColor: ({ commit }, color_theme) => {
      commit('setThemeColor', color_theme)
    }
  }
}

export default userStore
