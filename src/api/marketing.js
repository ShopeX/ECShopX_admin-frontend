import fetch from '../utils/fetch'

export function fetchEntryStoreRules(query) {
  return fetch({
    url: '/distributor/config/inRule',
    method: 'get',
    params: query
  })
}

export function saveEntryStoreRules(params) {
  return fetch({
    url: '/distributor/config/inRule',
    method: 'post',
    params
  })
}

export const fetchCustomPageInfo = (id) => {
  return fetch({
    url: `/wxa/customizepage/${id}`,
    method: 'get'
  })
}


export function saveDistributor(query) {
  if (query.distributor_id) {
    return fetch({
      url: '/distributor/' + query.distributor_id,
      method: 'put',
      params: query
    })
  } else {
    return fetch({
      url: '/distributor',
      method: 'post',
      params: query
    })
  }
}

export function saveDistributorInfo(params) {
  return fetch({
    url: '/distributor',
    method: 'post',
    params
  })
}

export function updateDistributorInfo(id, params) {
  return fetch({
    url: `/distributor/${id}`,
    method: 'put',
    params
  })
}

export function saveOpen(data) {
  return fetch({
    url: '/hfpay/enterapply/opensplit',
    method: 'post',
    params: data
  })
}
export function getDistributorList(query) {
  return fetch({
    url: '/distributors',
    method: 'get',
    params: query
  })
}

export function getBasicConfig() {
  return fetch({
    url: '/distribution/basic_config',
    method: 'get'
  })
}

export function saveBasicConfig(query) {
  return fetch({
    url: '/distribution/basic_config',
    method: 'post',
    params: query
  })
}

export function getDistributeLogs(query) {
  return fetch({
    url: '/distribution/logs',
    method: 'get',
    params: query
  })
}

export function getCashWithdrawalPayInfo(cash_withdrawal_id) {
  return fetch({
    url: '/distributor/cash_withdrawal/payinfo/' + cash_withdrawal_id,
    method: 'get'
  })
}

export function getCashWithdrawals(query) {
  return fetch({
    url: '/distribution/cash_withdrawals',
    method: 'get',
    params: query
  })
}

export function processCashWithdrawal(id, query) {
  return fetch({
    url: '/distribution/cash_withdrawal/' + id,
    method: 'put',
    params: query
  })
}

export function getDistributorCount(distributorId) {
  return fetch({
    url: '/distributor/count/' + distributorId,
    method: 'get'
  })
}

export function getDistributionCount() {
  return fetch({
    url: '/distribution/count',
    method: 'get'
  })
}

export function saveDistributorItems(query) {
  return fetch({
    url: '/distributor/items',
    method: 'post',
    params: query
  })
}

export function getDistributorItems(query) {
  return fetch({
    url: '/distributor/items',
    method: 'get',
    params: query
  })
}

export function deleteDistributorItems(query) {
  return fetch({
    url: '/distributor/items',
    method: 'delete',
    params: query
  })
}

export function exportDistributorItems(query) {
  return fetch({
    url: '/distributor/items/export',
    method: 'get',
    params: query
  })
}

export function getWxaDristributorCodeStream(query) {
  return fetch({
    url: '/distributor/wxacode',
    method: 'get',
    params: query
  })
}

export function getPageCode(query) {
  return fetch({
    url: '/wxa/codeunlimit',
    method: 'get',
    params: query
  })
}

export function delDistributorItems(query) {
  return fetch({
    url: '/distributor/item',
    method: 'delete',
    params: query
  })
}

export function updateDistributorItem(query) {
  return fetch({
    url: '/distributors/item',
    method: 'put',
    params: query
  })
}

export function setDefaultDistributor(query) {
  return fetch({
    url: '/distributor/default',
    method: 'post',
    params: query
  })
}

export function getSalesmanList(query) {
  return fetch({
    url: '/distributor/salesmans',
    method: 'get',
    params: query
  })
}

export function updateSalesman(salesmanId, query) {
  return fetch({
    url: '/distributor/salesman/' + salesmanId,
    method: 'put',
    params: query
  })
}

export function getSalesmanRole(query) {
  return fetch({
    url: '/distributor/salesman/role',
    method: 'get',
    params: query
  })
}

export function updateSalesmanRole(salesmanId, query) {
  return fetch({
    url: '/distributor/salesman/role/' + salesmanId,
    method: 'put',
    params: query
  })
}

export function addSalesman(query) {
  return fetch({
    url: '/distributor/salesman',
    method: 'post',
    params: query
  })
}

export function getDistributorInfo(query) {
  return fetch({
    url: '/distributors/info',
    method: 'get',
    params: query
  })
}

export function saveTag(params) {
  return fetch({
    url: '/distributor/tag',
    method: 'post',
    params: params
  })
}

export function getTagList(query) {
  return fetch({
    url: '/distributor/tag',
    method: 'get',
    params: query
  })
}

export function getTagInfo(tagId) {
  return fetch({
    url: '/distributor/tag/' + tagId,
    method: 'get'
  })
}

export function updateTag(tagId, params) {
  return fetch({
    url: '/distributor/tag/' + tagId,
    method: 'put',
    params: params
  })
}

export function deleteTag(tagId) {
  return fetch({
    url: '/distributor/tag/' + tagId,
    method: 'delete'
  })
}

export function distributorRelTags(query) {
  return fetch({
    url: '/distributor/reltag/',
    method: 'post',
    params: query
  })
}

export function getDistributorEasyList(query) {
  return fetch({
    url: '/distributor/easylist',
    method: 'get',
    params: query
  })
}

export function addDistributorShop(query) {
  if (query.distributor_id) {
    return fetch({
      url: '/shops/' + query.distributor_id,
      method: 'put',
      params: query
    })
  } else {
    return fetch({
      url: '/shops',
      method: 'post',
      params: query
    })
  }
}
export function setDefaultDistributorShop(query) {
  return fetch({
    url: '/dshops/setDefaultShop',
    method: 'post',
    params: query
  })
}
export function setDistributorShopStatus(query) {
  return fetch({
    url: '/dshops/setShopStatus',
    method: 'post',
    params: query
  })
}
export function getDistributorShopList(query) {
  return fetch({
    url: '/shops',
    method: 'get',
    params: query
  })
}
export function getDistributorShopDetail(id, query) {
  return fetch({
    url: '/shops/' + id,
    method: 'get',
    params: query
  })
}
export function deleteDistributorShop(id) {
  return fetch({
    url: '/shops/' + id,
    method: 'delete'
  })
}
export function getSalemanCustomerComplaints(params) {
  return fetch({
    url: '/distributor/salemanCustomerComplaints',
    method: 'get',
    params
  })
}
export function replySalemanCustomerComplaints(data) {
  return fetch({
    url: '/distributor/salemanCustomerComplaints',
    method: 'post',
    params: data
  })
}

// 获取导购通知列表
export function getSalespersonoticeList(params) {
  return fetch({
    url: '/salespersonotice/list',
    method: 'get',
    params
  })
}

// 新增导购通知
export function setSalespersonoticeNotice(data) {
  return fetch({
    url: '/salespersonotice/notice',
    method: 'post',
    params: data
  })
}

// 撤回通知导购通知
export function delSalespersonoticeWithdrawnotice(data) {
  return fetch({
    url: '/salespersonotice/withdrawnotice',
    method: 'post',
    params: data
  })
}

// 获取导购通知详情
export function getSalespersonoticeDetail(params) {
  return fetch({
    url: '/salespersonotice/detail',
    method: 'get',
    params
  })
}

// 修改导购通知
export function editSalespersonoticeNotice(data) {
  return fetch({
    url: '/salespersonotice/notice',
    method: 'put',
    params: data
  })
}

// 发送导购通知
export function setSalespersonoticeSendnotice(data) {
  return fetch({
    url: 'salespersonotice/sendnotice',
    method: 'post',
    params: data
  })
}

// 获取门店角色列表
export function getRoleList(query) {
  return fetch({
    url: 'distributor/salesperson/role',
    method: 'get',
    params: query
  })
}

// 获取门店角色信息
export function getRoleInfo(id, query) {
  return fetch({
    url: 'distributor/salesperson/role/' + id,
    method: 'get',
    params: query
  })
}

// 创建门店角色信息
export function createRole(params) {
  return fetch({
    url: 'distributor/salesperson/role/',
    method: 'post',
    params: params
  })
}

// 修改门店角色信息
export function updateRole(id, params) {
  return fetch({
    url: 'distributor/salesperson/role/' + id,
    method: 'put',
    params: params
  })
}

// 删除门店角色信息
export function deleteRole(id, query) {
  return fetch({
    url: 'distributor/salesperson/role/' + id,
    method: 'delete'
  })
}

// 获取距离信息
export function getDistance(params) {
  return fetch({
    url: 'distribution/getdistance',
    method: 'get',
    params
  })
}

// 设置距离信息
export function setDistance(params) {
  return fetch({
    url: 'distribution/setdistance',
    method: 'post',
    params: params
  })
}

// 查询经销商详情
export function getDealerDetail(id) {
  return fetch({
    url: '/adapay/dealer/' + id,
    method: 'get'
  })
}

// 经销商开启或禁用
export function setDealerStatus(query) {
  return fetch({
    url: '/adapay/dealer/disable',
    method: 'put',
    params: query
  })
}

// 经销商关联店铺
export function dealerRelStore(query) {
  return fetch({
    url: '/adapay/dealer/rel',
    method: 'put',
    params: query
  })
}

// 新增经销商
export function addDealer(params) {
  return fetch({
    url: '/account/management',
    method: 'post',
    params: params
  })
}

// 经销商重置密码
export function resertPassword(id) {
  return fetch({
    url: '/adapay/dealer/reset/' + id,
    method: 'put'
  })
}

// 根据商家tag查找对应商家
export function queryTagShop(params) {
  return fetch({
    url: '/distributors',
    method: 'get',
    params
  })
}

// 删除tag
export function NewdeleteTag(params) {
  return fetch({
    url: '/distributor/deltag',
    method: 'post',
    params
  })
}

// 获取商户列表
export function getMerchantsList(params) {
  return fetch({
    url: '/merchant/list',
    method: 'get',
    params
  })
}

// 获取可退货店铺列表
export function getAftersales(params) {
  return fetch({
    url: '/distributors/aftersales',
    method: 'get',
    params
  })
}

// 获取内购活动列表
// export function getPurchaseActivity(params) {
//   return fetch({
//     url: '/employeepurchase/activity',
//     method: 'get',
//     params
//   })
// }

// 创建内购活动
export function createPurchaseActivity(params) {
  return fetch({
    url: '/employeepurchase/activity',
    method: 'post',
    params
  })
}

// 更新内购活动
export function updatePurchaseActivity(activityId, params) {
  return fetch({
    url: `/employeepurchase/activity/${activityId}`,
    method: 'put',
    params
  })
}

// 内购活动添加商品
export function addGoodsInActivity(params) {
  return fetch({
    url: '/employeepurchase/activity/items',
    method: 'post',
    params
  })
}

// 内购活动商品选择规格
export function selectSkuOfItems(params) {
  return fetch({
    url: '/employeepurchase/activity/specitems',
    method: 'post',
    params
  })
}

// 内购活动列表
export function getPurchaseActivity(params) {
  return fetch({
    url: '/employeepurchase/activities',
    method: 'get',
    params
  })
}

// 获取活动商品列表
export function getActivityItems(params) {
  return fetch({
    url: '/employeepurchase/activity/items',
    method: 'get',
    params
  })
}

// 获取内购活动详情
export function getActivityItemDetail(activityId) {
  return fetch({
    url: `/employeepurchase/activity/${activityId}`,
    method: 'get'
  })
}

// 删除内购活动商品
export function deleteActivityItem(activityId, itemId, params) {
  return fetch({
    url: `/employeepurchase/activity/${activityId}/item/${itemId}`,
    method: 'delete',
    params
  })
}

// 修改活动商品价格、库存
export function updateActivityItem(params) {
  return fetch({
    url: `/employeepurchase/activity/items`,
    method: 'put',
    params
  })
}

// 设置活动是否共享库存
export function setActivityShareStore(params) {
  return fetch({
    url: `/employeepurchase/activity/if_share_store`,
    method: 'post',
    params
  })
}

// 取消内购活动
export function cancelPurchaseActivity(activityId) {
  return fetch({
    url: `/employeepurchase/activity/cancel/${activityId}`,
    method: 'post'
  })
}

// 暂停内购活动
export function pendingPurchaseActivity(activityId) {
  return fetch({
    url: `/employeepurchase/activity/suspend/${activityId}`,
    method: 'post'
  })
}

// 重新开始内购活动
export function activePurchaseActivity(activityId) {
  return fetch({
    url: `/employeepurchase/activity/active/${activityId}`,
    method: 'post'
  })
}

// 结束内购活动
export function endPurchaseActivity(activityId) {
  return fetch({
    url: `/employeepurchase/activity/end/${activityId}`,
    method: 'post'
  })
}

// 提前开始内购活动
export function aheadPurchaseActivity(activityId) {
  return fetch({
    url: `/employeepurchase/activity/ahead/${activityId}`,
    method: 'post'
  })
}


// 修改活动记录备注
export function updateRegistrationRecord(params) {
  return fetch({
    url: `/selfhelp/registrationRecord/update`,
    method: 'post',
    params
  })
}
