import fetch from '@/utils/fetch'

// 获取模板
export function getTemplate(query) {
  return fetch({
    url: '/espier/upload_template',
    method: 'get',
    params: query
  })
}

// 上传文件
export function uploadFiles(query) {
  return fetch({
    url: '/espier/upload_file',
    method: 'post',
    params: query
  })
}

// 获取上传文件列表
export function getFlieList(query) {
  return fetch({
    url: '/espier/upload_files',
    method: 'get',
    params: query
  })
}

// 处理失败
export function exportUploadErrorFile(id, query) {
  return fetch({
    url: '/espier/upload_error_file_export/' + id,
    method: 'get',
    params: query
  })
}
