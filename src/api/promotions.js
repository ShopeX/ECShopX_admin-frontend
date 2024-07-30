import fetch from '../utils/fetch'

export function saveRegisterPromotions (query) {
  return fetch({
    url: '/promotions/register',
    method: 'post',
    params: query
  })
}

export function getRegisterPromotions (query) {
  return fetch({
    url: '/promotions/register',
    method: 'get',
    params: query
  })
}

export function saveRegisterPoint (query) {
  return fetch({
    url: '/promotions/point',
    method: 'post',
    params: query
  })
}

export function getPointRule (query) {
  return fetch({
    url: '/member/point/rule',
    method: 'get',
    params: query
  })
}

export function savePointRule (query) {
  return fetch({
    url: '/member/point/rule',
    method: 'put',
    params: query
  })
}

export function getRegisterPoint (query) {
  return fetch({
    url: '/promotions/point',
    method: 'get',
    params: query
  })
}

export function getSmsBasic () {
  return fetch({
    url: '/sms/basic',
    method: 'get'
  })
}

export function getSmsTemplateList () {
  return fetch({
    url: '/sms/templates',
    method: 'get'
  })
}

export function updateSmsTemplate (query) {
  return fetch({
    url: '/sms/template',
    method: 'patch',
    params: query
  })
}

export function getSmsSign () {
  return fetch({
    url: '/sms/sign',
    method: 'get'
  })
}

export function saveSmsSign (query) {
  return fetch({
    url: '/sms/sign',
    method: 'post',
    params: query
  })
}

export function addBargins (query) {
  return fetch({
    url: '/promotions/bargains',
    method: 'post',
    params: query
  })
}

export function updateBargains (bargainId, query) {
  return fetch({
    url: '/promotions/bargains/' + bargainId,
    method: 'put',
    params: query
  })
}

export function terminateBargains (bargainId) {
  return fetch({
    url: '/promotions/bargains/termination/' + bargainId,
    method: 'put'
  })
}

export function getBargainsDetail (bargainId) {
  return fetch({
    url: '/promotions/bargains/' + bargainId,
    method: 'get'
  })
}

export function deleteBargains (bargainId) {
  return fetch({
    url: '/promotions/bargains/' + bargainId,
    method: 'delete'
  })
}

export function listBargins (query) {
  return fetch({
    url: '/promotions/bargains',
    method: 'get',
    params: query
  })
}

export function getActivity (query) {
  return fetch({
    url: '/promotions/activity/lists',
    method: 'get',
    params: query
  })
}

export function isValidActivity (query) {
  return fetch({
    url: '/promotions/activity/validNum',
    method: 'post',
    params: query
  })
}

export function invalidActivity (query) {
  return fetch({
    url: '/promotions/activity/invalid',
    method: 'put',
    params: query
  })
}

export function createActivity (query) {
  return fetch({
    url: '/promotions/activity/create',
    method: 'post',
    params: query
  })
}

export function giveCoupons (query) {
  return fetch({
    url: '/promotions/activity/give',
    method: 'post',
    params: query
  })
}

export function getGiveLogList (query) {
  return fetch({
    url: '/promotions/activity/give',
    method: 'get',
    params: query
  })
}

export function getGiveErrorLogList (id, query) {
  return fetch({
    url: '/promotions/activity/give/' + id,
    method: 'get',
    params: query
  })
}

//以下为新的注册营销
export function getDistributorList (query) {
  return fetch({
    url: '/promotions/distributor',
    method: 'get',
    params: query
  })
}

// 拼团活动
export function getGroupsList (query) {
  return fetch({
    url: '/promotions/groups',
    method: 'get',
    params: query
  })
}

// 拼团活动
export function getGroupsTeamList (group_id, query) {
  return fetch({
    url: '/promotions/groups/' + group_id + '/team/',
    method: 'get',
    params: query
  })
}

export function getRegisterList (query) {
  return fetch({
    url: '/promotions/register/distributor',
    method: 'get',
    params: query
  })
}

export function getRegisterInfo (id) {
  return fetch({
    url: '/promotions/register/distributor/' + id,
    method: 'get'
  })
}

export function deleteRegister (id) {
  return fetch({
    url: '/promotions/register/distributor/' + id,
    method: 'delete'
  })
}

export function createRegister (query) {
  return fetch({
    url: '/promotions/register/distributor',
    method: 'post',
    params: query
  })
}

export function getGroupsTeamInfo (team_id, query) {
  return fetch({
    url: '/promotions/groups/team/' + team_id,
    method: 'get',
    params: query
  })
}

export function getGroupsInfo (group_id, query) {
  return fetch({
    url: '/promotions/groups/' + group_id,
    method: 'get',
    params: query
  })
}

export function createGroupActivity (params) {
  return fetch({
    url: '/promotions/groups',
    method: 'post',
    params: params
  })
}

export function updateGroupActivity (group_id, params) {
  return fetch({
    url: '/promotions/groups/' + group_id,
    method: 'put',
    params: params
  })
}

export function finishGroupActivity (group_id) {
  return fetch({
    url: '/promotions/groups/finish/' + group_id,
    method: 'put'
  })
}

export function deleteGroupActivity (group_id) {
  return fetch({
    url: '/promotions/groups/' + group_id,
    method: 'delete'
  })
}

export function getPopularizeSetting () {
  return fetch({
    url: '/popularize/config',
    method: 'get'
  })
}


export function getPopularizeSettingStore (data) {
  return fetch({
    url: '/popularize/config',
    method: 'get',
    params: data

  })
}


export function setPopularizeSetting (data) {
  return fetch({
    url: '/popularize/config',
    method: 'post',
    params: data
  })
}

export function addPromoter (data) {
  return fetch({
    url: '/popularize/promoter/add',
    method: 'post',
    params: data
  })
}

export function getPopularizeList (data) {
  return fetch({
    url: '/popularize/promoter/list',
    method: 'get',
    params: data
  })
}

export function exportPopularizeData (data) {
  return fetch({
    url: '/popularize/promoter/export',
    method: 'get',
    params: data
  })
}


export function exportPopularizeStatic (data) {
  return fetch({
    url: '/popularize/promoter/exportPopularizeStatic',
    method: 'get',
    params: data
  })
}

export function exportPopularizeOrder (data) {
  return fetch({
    url: '/popularize/promoter/exportPopularizeOrder',
    method: 'get',
    params: data
  })
}



export function getPopularizeChildren (data) {
  return fetch({
    url: '/popularize/promoter/children',
    method: 'get',
    params: data
  })
}

export function editPopularizeRemove (data) {
  return fetch({
    url: '/popularize/promoter/remove',
    method: 'put',
    params: data
  })
}

export function updatePromoterShop (data) {
  return fetch({
    url: '/popularize/promoter/shop',
    method: 'put',
    params: data
  })
}

export function editPopularizeGrade (data) {
  return fetch({
    url: '/popularize/promoter/grade',
    method: 'put',
    params: data
  })
}

export function editPopularizeDisabled (data) {
  return fetch({
    url: '/popularize/promoter/disabled',
    method: 'put',
    params: data
  })
}

export function getPromoterGradeConfig () {
  return fetch({
    url: '/popularize/promoter/config',
    method: 'get'
  })
}

export function setPromoterGradeConfig (data) {
  return fetch({
    url: '/popularize/promoter/config',
    method: 'post',
    params: data
  })
}

export function withdrawalApplications (params) {
  return fetch({
    url: '/popularize/cashWithdrawals',
    method: 'get',
    params: params
  })
}

export function checkWithdrawal (id, params) {
  return fetch({
    url: `/popularize/cash_withdrawals/${id}`,
    method: 'put',
    params: params
  })
}

export function withdrawalPayinfo (id) {
  return fetch({
    url: `/popularize/cashWithdrawal/payinfo/${id}`,
    method: 'get'
  })
}

export function withdrawalStatistics (params) {
  return fetch({
    url: '/popularize/brokerage/count',
    method: 'get',
    params: params
  })
}

export function getBrokerageLog (params) {
  return fetch({
    url: '/popularize/brokerage/logs',
    method: 'get',
    params: params
  })
}

export function exportTaskBrokerageCount (params) {
  return fetch({
    url: '/popularize/export/taskBrokerage/count',
    method: 'get',
    params: params
  })
}

export function getTaskBrokerageLog (params) {
  return fetch({
    url: '/popularize/taskBrokerage/logs',
    method: 'get',
    params: params
  })
}

export function getTaskBrokerageCountList (params) {
  return fetch({
    url: '/popularize/taskBrokerage/count',
    method: 'get',
    params: params
  })
}

export function listCheckInList (params) {
  return fetch({
    url: '/promotions/checkin/getlist',
    method: 'get',
    params: params
  })
}

export function seckillActivityCreate (params) {
  return fetch({
    url: '/promotions/seckillactivity/create',
    method: 'post',
    params: params
  })
}
export function seckillActivityUpdateStatus (params) {
  return fetch({
    url: '/promotions/seckillactivity/updatestatus',
    method: 'put',
    params: params
  })
}
export function seckillActivityUpdate (params) {
  return fetch({
    url: '/promotions/seckillactivity/update',
    method: 'put',
    params: params
  })
}
export function seckillActivityGetList (params) {
  return fetch({
    url: '/promotions/seckillactivity/getlist',
    method: 'get',
    params: params
  })
}
export function seckillActivityGetInfo (params) {
  return fetch({
    url: '/promotions/seckillactivity/getinfo',
    method: 'get',
    params: params
  })
}

export function seckillActivityWxcode (params) {
  return fetch({
    url: '/promotions/seckillactivity/wxcode',
    method: 'get',
    params: params
  })
}

export function getSeckillItemList (params) {
  return fetch({
    url: '/promotions/seckillactivity/getIteminfo',
    method: 'get',
    params: params
  })
}

// --start--抽奖活动--

export function getLuckyDrawList (query) {
  return fetch({
    url: '/promotions/luckydraw',
    method: 'get',
    params: query
  })
}

export function getLuckyDrawTeamList (luckydraw_id, query) {
  return fetch({
    url: '/promotions/luckydraw/' + luckydraw_id + '/team/',
    method: 'get',
    params: query
  })
}

export function getLuckyDrawTeamInfo (team_id, query) {
  return fetch({
    url: '/promotions/luckydraw/team/' + team_id,
    method: 'get',
    params: query
  })
}

export function getLuckyDrawInfo (luckydraw_id, query) {
  return fetch({
    url: '/promotions/luckydraw/' + luckydraw_id,
    method: 'get',
    params: query
  })
}

export function createLuckyDrawActivity (params) {
  return fetch({
    url: '/promotions/luckydraw',
    method: 'post',
    params: params
  })
}

export function updateLuckyDrawActivity (luckydraw_id, params) {
  return fetch({
    url: '/promotions/luckydraw/' + luckydraw_id,
    method: 'put',
    params: params
  })
}

export function getMarketingActivityList (params) {
  return fetch({
    url: '/marketing/getlist',
    method: 'get',
    params: params
  })
}

export function getMarketingActivityInfo (params) {
  return fetch({
    url: '/marketing/getinfo',
    method: 'get',
    params: params
  })
}

export function updateMarketingActivity (params) {
  return fetch({
    url: '/marketing/update',
    method: 'put',
    params: params
  })
}

export function addMarketingActivity (params) {
  return fetch({
    url: '/marketing/create',
    method: 'post',
    params: params
  })
}

export function getMarketingActivityItemList (params) {
  return fetch({
    url: '/marketing/getItemList',
    method: 'get',
    params: params
  })
}

export function removeMarketingActivity (params) {
  return fetch({
    url: '/marketing/delete',
    method: 'delete',
    params: params
  })
}

export function finishLuckyDrawActivity (luckydraw_id) {
  return fetch({
    url: '/promotions/luckydraw/finish/' + luckydraw_id,
    method: 'put'
  })
}

export function deleteLuckyDrawActivity (luckydraw_id) {
  return fetch({
    url: '/promotions/luckydraw/' + luckydraw_id,
    method: 'delete'
  })
}

export function luckydrawDelivery (params) {
  return fetch({
    url: '/promotions/luckydraw/delivery',
    method: 'post',
    params: params
  })
}

export function getLuckydrawShow (query) {
  return fetch({
    url: '/promotions/luckydraw_show',
    method: 'get',
    params: query
  })
}
export function setLuckydrawShow (params) {
  return fetch({
    url: '/promotions/luckydraw_show',
    method: 'post',
    params: params
  })
}

// 获取抽奖规则
export function getLuckydrawRules (query) {
  return fetch({
    url: '/promotions/luckydraw_rules',
    method: 'get',
    params: query
  })
}
// 设置抽奖规则
export function setLuckydrawRules (params) {
  return fetch({
    url: '/promotions/luckydraw_rules',
    method: 'post',
    params: params
  })
}
// --end--抽奖活动--

export function saveRecommendLikeItem (params) {
  return fetch({
    url: '/promotions/recommendlike',
    method: 'post',
    params: params
  })
}
export function deleteRecommendLikeItem (id) {
  return fetch({
    url: '/promotions/recommendlike/' + id,
    method: 'delete'
  })
}
export function getRecommendLikeItemList (params) {
  return fetch({
    url: '/promotions/recommendlike',
    method: 'get',
    params: params
  })
}
export function getRecommendLikeItems (params) {
  return fetch({
    url: '/promotions/recommendlikes',
    method: 'get',
    params: params
  })
}
export function updateRecommendLikeSort (params) {
  return fetch({
    url: '/promotions/recommendlike',
    method: 'put',
    params: params
  })
}

export function getPackagePromotions (query) {
  return fetch({
    url: '/promotions/package',
    method: 'get',
    params: query
  })
}

export function getPackagePromotionsInfo (id) {
  return fetch({
    url: '/promotions/package/' + id,
    method: 'get'
  })
}

export function createPackagePromotions (params) {
  return fetch({
    url: '/promotions/package',
    method: 'post',
    params: params
  })
}

export function updatePackagePromotions (id, params) {
  return fetch({
    url: '/promotions/package/' + id,
    method: 'put',
    params: params
  })
}

export function cancelPackagePromotions (id) {
  return fetch({
    url: '/promotions/package/cancel/' + id,
    method: 'delete'
  })
}

export function getLimitPromotions (query) {
  return fetch({
    url: '/promotions/limit',
    method: 'get',
    params: query
  })
}

export function getLimitPromotionsInfo (id) {
  return fetch({
    url: '/promotions/limit/' + id,
    method: 'get'
  })
}

export function createLimitPromotions (params) {
  return fetch({
    url: '/promotions/limit',
    method: 'post',
    params: params
  })
}

export function updateLimitPromotions (id, params) {
  return fetch({
    url: '/promotions/limit/' + id,
    method: 'put',
    params: params
  })
}

export function cancelLimitPromotions (id) {
  return fetch({
    url: '/promotions/limit/cancel/' + id,
    method: 'delete'
  })
}

// 大转盘获取
export function getSurntableconfig (params) {
  return fetch({
    url: '/promotions/turntableconfig',
    params: params,
    method: 'get'
  })
}

// 大转盘保存
export function setSurntableconfig (params) {
  return fetch({
    url: '/promotions/turntableconfig',
    params: params,
    method: 'post'
  })
}

// 根据优惠卷id获取可用的商品
export function getGoodsbycoupon (id, params = {}) {
  return fetch({
    url: `/goods/goodsbycoupon/${id}`,
    params: params,
    method: 'get'
  })
}

// 获取活动文章列表
export function getActivearticleList (query) {
  return fetch({
    url: '/promotions/activearticle/list',
    method: 'get',
    params: query
  })
}

// 获取活动详情
export function getActivearticle (id) {
  return fetch({
    url: `/promotions/activearticle/${id}`,
    method: 'get'
  })
}

// 创建文章
export function setActivearticle (query = {}) {
  return fetch({
    url: '/promotions/activearticle',
    params: query,
    method: 'post'
  })
}

// 删除活动文章
export function delActivearticle (id) {
  return fetch({
    url: '/promotions/activearticle/' + id,
    method: 'delete'
  })
}

export function createSpecificcrowddiscount (params) {
  return fetch({
    url: '/specific/crowd/discount',
    method: 'post',
    params: params
  })
}
export function updateSpecificcrowddiscount (params) {
  return fetch({
    url: '/specific/crowd/discount',
    method: 'put',
    params: params
  })
}
export function getListSpecificcrowddiscount (params) {
  return fetch({
    url: '/specific/crowd/discountList',
    method: 'get',
    params: params
  })
}
export function getInfoSpecificcrowddiscount (params) {
  return fetch({
    url: '/specific/crowd/discountInfo',
    method: 'get',
    params: params
  })
}

export function specificcrowddiscountList (params) {
  return fetch({
    url: '/specific/crowd/discountLogList',
    method: 'get',
    params: params
  })
}

// 修改活动文章
export function putActivearticle (params) {
  console.log('delete', params)
  return fetch({
    url: '/promotions/activearticle',
    method: 'put',
    params: params
  })
}

export function getLiverooms (query) {
  return fetch({
    url: '/promotions/liverooms',
    method: 'get',
    params: query
  })
}

export function seckillActivityGetItemsList (query) {
  return fetch({
    url: '/promotions/seckillactivity/search/items',
    method: 'get',
    params: query
  })
}

export function getPointupvaluationList (query) {
  return fetch({
    url: '/promotions/pointupvaluation/lists',
    method: 'get',
    params: query
  })
}

export function pointupvaluationUpdateStatus (params) {
  return fetch({
    url: '/promotions/pointupvaluation/updatestatus',
    method: 'put',
    params: params
  })
}

export function getPointupvaluationInfo (query) {
  return fetch({
    url: '/promotions/pointupvaluation/getinfo',
    method: 'get',
    params: query
  })
}

export function createPointupvaluation (query) {
  return fetch({
    url: '/promotions/pointupvaluation/create',
    method: 'post',
    params: query
  })
}

export function updatePointupvaluation (query) {
  return fetch({
    url: '/promotions/pointupvaluation/update',
    method: 'put',
    params: query
  })
}

export function createExtrapoint (query) {
  return fetch({
    url: '/promotions/extrapoint',
    method: 'post',
    params: query
  })
}

export function updateExtrapoint (query) {
  return fetch({
    url: '/promotions/extrapoint',
    method: 'put',
    params: query
  })
}

export function getExtrapointInfo (id) {
  return fetch({
    url: '/promotions/extrapoint/' + id,
    method: 'get'
  })
}

export function getExtrapointList (query) {
  return fetch({
    url: '/promotions/extrapoint/lists',
    method: 'get',
    params: query
  })
}

export function extrapointUpdateStatus (params) {
  return fetch({
    url: '/promotions/extrapoint/invalid',
    method: 'put',
    params: params
  })
}

export function getCommunityActivity (query) {
  return fetch({
    url: '/community/list',
    method: 'get',
    params: query
  })
}

export function communityDeliver (query) {
  return fetch({
    url: '/community/chief/deliver',
    method: 'post',
    params: query
  })
}

export function communityOrderExport (query) {
  return fetch({
    url: '/community/orders/export',
    method: 'GET',
    params: query
  })
}