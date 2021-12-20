import fetch from '../utils/fetch'

export function handleUploadFile(query) {
  return fetch({
    url: '/espier/upload_file',
    method: 'post',
    params: query
  })
}

export function getUploadLists(query) {
  return fetch({
    url: '/espier/upload_files',
    method: 'get',
    params: query
  })
}

export function exportUploadErrorFile(id, query) {
  return fetch({
    url: '/espier/upload_error_file_export/' + id,
    method: 'get',
    params: query
  })
}

export function exportUploadTemplate(query) {
  return fetch({
    url: '/espier/upload_template',
    method: 'get',
    params: query
  })
}

export function getBrandLogo() {
  return fetch({
    url: '/companys/setting',
    method: 'get'
  })
}

export function getAddress() {
  return fetch({
    url: '/espier/address',
    method: 'get'
  })
}

export function download(){
  return fetch({
    url:'/espier/upload_template',
    method:'get',
    params:{
      file_type:'normal_orders',
      file_name:'批量发货'
    }
  })
}