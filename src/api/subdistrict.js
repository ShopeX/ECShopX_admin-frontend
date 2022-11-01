import fetch from '@/utils/fetch'

// 列表
export function getSubDistrictList (query) {
  return fetch({
    url: '/espier/subdistrict',
    method: 'get',
    params: query
  })
}

// 详情
export function getSubDistrictInfo (subDistrictId) {
  return fetch({
    url: 'espier/subdistrict/' + subDistrictId,
    method: 'get'
  })
}

// 新增
export function addSubDistrictInfo (query) {
  return fetch({
    url: 'espier/subdistrict',
    method: 'put',
    params: query
  })
}

// 编辑
export function updateSubDistrictInfo (query) {
  return fetch({
    url: 'espier/subdistrict',
    method: 'put',
    params: query
  })
}

// 删除
export function deleteSubDistrictInfo (subDistrictId) {
  return fetch({
    url: 'espier/subdistrict/' + subDistrictId,
    method: 'delete'
  })
}
