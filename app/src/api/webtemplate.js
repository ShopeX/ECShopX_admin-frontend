import fetch from '@/utils/fetch'

export const fetchTemplateList = (params) => {
  return fetch({
    url: '/pctemplate/lists',
    method: 'get',
    params
  })
}

export const addPageTemplate = (data) => {
  return fetch({
    url: '/pctemplate/add',
    method: 'post',
    params: data
  })
}

export const editPageTemplate = (data) => {
  return fetch({
    url: '/pctemplate/edit',
    method: 'put',
    params: data
  })
}

export const deletePageTemplate = (id) => {
  return fetch({
    url: `/pctemplate/delete/${id}`,
    method: 'delete'
  })
}

export const getTemplateContent = (params) => {
  return fetch({
    url: '/pctemplate/getTemplateContent',
    method: 'get',
    params
  })
}
