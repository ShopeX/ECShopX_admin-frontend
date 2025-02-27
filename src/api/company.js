import fetch from '@/utils/fetch'

export function activate (query) {
  return fetch({
    url: '/company/activate',
    method: 'post',
    params: query
  })
}

export function getDomainSetting () {
  return fetch({
    url: '/company/domain_setting',
    method: 'get'
  })
}

export function setDomainSetting (data) {
  return fetch({
    url: '/company/domain_setting',
    method: 'post',
    params: data
  })
}

export function getActivateInfo () {
  return fetch({
    url: '/company/activate',
    method: 'get'
  })
}
export function ydleadsInfo (data) {
  return fetch({
    url: '/ydleads/create',
    method: 'post',
    params: data
  })
}

export function getResourceList (query) {
  return fetch({
    url: '/company/resources',
    method: 'get',
    params: query
  })
}

export function updateCompanyInfo (query) {
  return fetch({
    url: '/company',
    method: 'patch',
    params: query
  })
}

//以下为账号管理接口

export function createAccount (query) {
  return fetch({
    url: '/account/management',
    method: 'post',
    params: query
  })
}

export function getAccountInfo (id) {
  return fetch({
    url: '/account/management/' + id,
    method: 'get'
  })
}

export function getAccountList (query) {
  return fetch({
    url: '/account/management',
    method: 'get',
    params: query
  })
}

export function updateAccountInfo (id, query) {
  return fetch({
    url: '/account/management/' + id,
    method: 'patch',
    params: query
  })
}

export function deleteAccountInfo (id) {
  return fetch({
    url: '/account/management/' + id,
    method: 'delete'
  })
}

//以下为角色管理接口

export function createRoles (query) {
  return fetch({
    url: '/roles/management',
    method: 'post',
    params: query
  })
}

export function getRolesInfo (id) {
  return fetch({
    url: '/roles/management/' + id,
    method: 'get'
  })
}

export function getRolesList (query) {
  return fetch({
    url: '/roles/management',
    method: 'get',
    params: query
  })
}

export function updateRolesInfo (id, query) {
  return fetch({
    url: '/roles/management/' + id,
    method: 'patch',
    params: query
  })
}

export function deleteRole (id) {
  return fetch({
    url: '/roles/management/' + id,
    method: 'delete'
  })
}

export function getPermissionList (query) {
  return fetch({
    url: '/permission',
    method: 'get',
    params: query
  })
}

export function createCurrencyInfo (query) {
  return fetch({
    url: '/currency',
    method: 'post',
    params: query
  })
}

export function deleteCurrencyInfo (id) {
  return fetch({
    url: '/currency/' + id,
    method: 'delete'
  })
}

export function updateCurrencyInfo (id, query) {
  return fetch({
    url: '/currency/' + id,
    method: 'put',
    params: query
  })
}

export function getCurrencytLists (query) {
  return fetch({
    url: '/currency',
    method: 'get',
    params: query
  })
}
export function getCurrencytInfo (id) {
  return fetch({
    url: '/currency/' + id,
    method: 'get'
  })
}

export function setDefaultCurrency (id) {
  return fetch({
    url: '/currencySetDefault/' + id,
    method: 'put'
  })
}

export function getDefaultCurrency () {
  return fetch({
    url: '/currencyGetDefault',
    method: 'get'
  })
}

export function setCompanySetting (query) {
  return fetch({
    url: '/company/setting',
    method: 'post',
    params: query
  })
}

export function getCompanySetting () {
  return fetch({
    url: '/company/setting',
    method: 'get'
  })
}

export function getCompanyStatistics () {
  return fetch({
    url: '/getStatistics',
    method: 'get'
  })
}

export function getSelfDeliveryAddress () {
  return fetch({
    url: '/setting/selfdelivery',
    method: 'get'
  })
}

export function setSelfDeliveryAddress (query) {
  return fetch({
    url: '/setting/selfdelivery',
    method: 'post',
    params: query
  })
}

export function shopLoginSelectShopId (query) {
  return fetch({
    url: '/operator/select/distributor',
    method: 'post',
    params: query
  })
}

export function getCompanysLogs (query) {
  var object = fetch({ url: '/company/operatorlogs', method: 'get', params: query })
  return object.then((res) => {
    return res.data.data
  })
}

export function getCertificate () {
  return fetch({
    url: '/third/saascert/certificate',
    method: 'get'
  })
}

export function deleteCertificateInfo () {
  return fetch({
    url: '/third/saascert/delete/certificate',
    method: 'get'
  })
}

export function bindRelation () {
  return fetch({
    url: '/third/saascert/apply/bindrelation',
    method: 'get'
  })
}

export function acceptRelation () {
  return fetch({
    url: '/third/saascert/accept/bindrelation',
    method: 'get'
  })
}

export function getWebUrlSetting () {
  return fetch({
    url: '/setting/weburl',
    method: 'get'
  })
}

export function saveWebUrlSetting (query) {
  return fetch({
    url: '/setting/weburl',
    method: 'post',
    params: query
  })
}

export function getRateSetting () {
  return fetch({
    url: '/traderate/setting',
    method: 'get'
  })
}
export function setRateSetting (query) {
  return fetch({
    url: '/traderate/setting',
    method: 'post',
    params: query
  })
}
export function getShareSetting () {
  return fetch({
    url: '/share/setting',
    method: 'get'
  })
}
export function setShareSetting (query) {
  return fetch({
    url: '/share/setting',
    method: 'post',
    params: query
  })
}

export function getWhitelistSetting () {
  return fetch({
    url: '/member/whitelist/setting',
    method: 'get'
  })
}
export function setWhitelistSetting (query) {
  return fetch({
    url: '/member/whitelist/setting',
    method: 'post',
    params: query
  })
}

export function getPickupcodeSetting () {
  return fetch({
    url: '/pickupcode/setting',
    method: 'get'
  })
}
export function setPickupcodeSetting (query) {
  return fetch({
    url: '/pickupcode/setting',
    method: 'post',
    params: query
  })
}

export function getGiftSetting () {
  return fetch({
    url: '/gift/setting',
    method: 'get'
  })
}
export function setGiftSetting (query) {
  return fetch({
    url: '/gift/setting',
    method: 'post',
    params: query
  })
}

export function getSendOmsSetting () {
  return fetch({
    url: '/sendoms/setting',
    method: 'get'
  })
}
export function setSendOmsSetting (query) {
  return fetch({
    url: '/sendoms/setting',
    method: 'post',
    params: query
  })
}

export function getNoStores () {
  return fetch({
    url: '/nostores/setting',
    method: 'get'
  })
}
export function setNoStores (query) {
  return fetch({
    url: '/nostores/setting',
    method: 'post',
    params: query
  })
}

export function getRechargeSetting () {
  return fetch({
    url: '/recharge/setting',
    method: 'get'
  })
}
export function setRechargeSetting (query) {
  return fetch({
    url: '/recharge/setting',
    method: 'post',
    params: query
  })
}

export function getRepeatCancelSetting () {
  return fetch({
    url: '/trade/cancel/setting',
    method: 'get'
  })
}
export function setRepeatCancelSetting (query) {
  return fetch({
    url: '/trade/cancel/setting',
    method: 'post',
    params: query
  })
}

export function setItemStoreSetting (query) {
  return fetch({
    url: '/itemStore/setting',
    method: 'post',
    params: query
  })
}

export function getItemStoreSetting (query) {
  return fetch({
    url: '/itemStore/setting',
    method: 'get',
    params: query
  })
}

export function setItemSalesSetting (query) {
  return fetch({
    url: '/itemSales/setting',
    method: 'post',
    params: query
  })
}

export function getItemSalesSetting (query) {
  return fetch({
    url: '/itemSales/setting',
    method: 'get',
    params: query
  })
}

export function setInvoiceStatus (query) {
  return fetch({
    url: '/invoice/setting',
    method: 'post',
    params: query
  })
}

export function getInvoiceStatus (query) {
  return fetch({
    url: '/invoice/setting',
    method: 'get',
    params: query
  })
}

export function getDomainH5Setting (query) {
  return fetch({
    url: '/company/domain_setting',
    method: 'get',
    params: query
  })
}

export function systemChangelog () {
  return fetch({
    url: '/espier/system/changelog',
    method: 'post'
  })
}

export function systemUpgrade () {
  return fetch({
    url: '/espier/system/upgrade',
    method: 'post'
  })
}

export function detectVersion () {
  return fetch({
    url: '/espier/system/detect_version',
    method: 'post'
  })
}

//处方药开关
export function setPharmaIndustry (query) {
  return fetch({
    url: '/pharmaIndustry/setting',
    method: 'post',
    params: query
  })
}

export function setDianwuShowStatus (query) {
  return fetch({
    url: '/dianwu/setting',
    method: 'post',
    params: query
  })
}

export function getDianwuShowStatus (query) {
  return fetch({
    url: '/dianwu/setting',
    method: 'get',
    params: query
  })
}

export function getItemPriceSetting () {
  return fetch({
    url: '/itemPrice/setting',
    method: 'get'
  })
}

export function saveItemPriceSetting (params) {
  return fetch({
    url: '/itemPrice/setting',
    method: 'post',
    params
  })
}

export function getGlobalSetting () {
  return fetch({
    url: '/settings',
    method: 'get'
  })
}

export function setGlobalSetting () {
  return fetch({
    url: '/settings',
    method: 'post'
  })
}
