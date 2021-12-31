import fetch from '@/utils/fetch'

/* 商家入驻 */

// 获取省市区
export function getArea(params={}) {
    return fetch({
        url: '/espier/address',
        method: 'get',
        params: params
    })
}

// 商家分类列表
export function getMerchantsClassification(params = {}) {
    return fetch({
        url: '/merchant/type/list',
        method: 'get',
        params: params
    })
}
//新增商家分类
export function addMerchantsClassification(params = {}) {
    return fetch({
        url: '/merchant/type/create',
        method: 'post',
        params: params
    })
}

// 编辑商家分类
export function editMerchantsClassification(id, params = {}) {
    return fetch({
        url: `/merchant/type/${id}`,
        method: 'put',
        params
    })
}

// 删除商家分类
export function deleteMerchantsClassification(id) {
    return fetch({
        url: `/merchant/type/${id}`,
        method: 'delete',
    })
}

//获取商家基础配置
export function getShopConfig() {
    return fetch({
        url: '/merchant/basesetting',
        method: 'get'
    })
}
// b保存商家基础设置
export function saveShopConfig(params) {
    return fetch({
        url: '/merchant/basesetting',
        method: 'post',
        params
    })
}

// 添加/更新 商家
export function addTheBusinessman(params, id) {
    return fetch({
        url: `/merchant${id ? `/${id}` : ''}`,
        method: 'post',
        params
    })
}

// 商户入驻申请列表
export function getApplicationListForMerchantEntry(params = {}) {
    return fetch({
        url: `/merchant/settlement/apply/list`,
        method: 'get',
        params
    })

}

// 商户账号管理列表
export function getMerchantAccountList(params = {}) {
    return fetch({
        url: '/merchant/operator',
        method: 'get',
        params
    })
}

// 获取商户详情
export function getTheMerchant(params, id) {
    return fetch({
        url: `/merchant/detail/${id}`,
        method: 'get',
        params
    })
}

//更新商户的商品审核状态
export function setCommodityAudit(params, id) {
    return fetch({
        url: `/merchant/auditgoods/update/${id}`,
        method: 'post',
        params
    })
}
export function setMerchantsState(params, id) {
    return fetch({
        url: `/merchant/disabled/update/${id}`,
        method: 'post',
        params
    })
}

// 重置商户密码
export function setChangePassword(id) {
    return fetch({
        url: `/merchant/operator/${id}`,
        method: 'put',
    })
}

// 商户入驻详情 
export function merchantsInDetail(id) {
    return fetch({
        url:`/merchant/settlement/apply/${id}`,
        method:'get'
    })
}

// 审核商户入驻
export function setCheckTheEntryOfMerchants(params={}) {
    return fetch({
        url:`/merchant/settlement/apply/audit`,
        method:'post',
        params
    })
}

// 商家端获取商户信息
export function getTheMerchantInfo() {
    return fetch({
        url:'/merchant/info',
        method:'get'
    })
}
export function updateTheMerchantInfo(params={}) {
    return fetch({
        url:'/merchant/operator',
        method:'post',
        params
    })
}

// 获取商户类型
export function getMerchantsType(params) {
    return fetch({
        url:'/merchant/visibletype/list',
        method:'get',
        params
    })
}