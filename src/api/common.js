import fetch, { axios } from '@/utils/fetch'
import store from '@/store'

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

export function download() {
  return fetch({
    url: '/espier/upload_template',
    method: 'get',
    params: {
      file_type: 'normal_orders',
      file_name: '批量发货'
    }
  })
}

// 获取文件
export function getFileBlob(url) {
  return new Promise(function (resolve, reject) {
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
      headers: { 'Authorization': 'bearer ' + store.getters.token }
    })
      .then((data) => {
        resolve(data.data)
      })
      .catch((error) => {
        reject(error.toString())
      })
  })
}
