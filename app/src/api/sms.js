import fetch from '@/utils/fetch'

export function setTheNewSignature(params = {}) {
  return fetch({
    url: '/aliyunsms/sign/add',
    method: 'post',
    params
  })
}

export function getTheSignature(params) {
  return fetch({
    url: `/aliyunsms/sign/info`,
    method: 'get',
    params
  })
}

export function editTheSignature(params) {
  return fetch({
    url: `/aliyunsms/sign/modify`,
    method: 'post',
    params
  })
}

export function deleteTheSignature(id) {
  return fetch({
    url: `/aliyunsms/sign/delete/${id}`,
    method: 'delete',
  })
}
