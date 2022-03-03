import fetch from '../utils/fetch'

export function getMemberCardDetail () {
  return fetch({
    url: '/membercard',
    method: 'get'
  })
}

export function setMemberCard (query) {
  return fetch({
    url: '/membercard',
    method: 'put',
    params: query
  })
}

export function getGradeList () {
  return fetch({
    url: '/membercard/grades',
    method: 'get'
  })
}

export function updateGrade (query) {
  return fetch({
    url: '/membercard/grade',
    method: 'put',
    params: query
  })
}

export function getDefaultGrade () {
  return fetch({
    url: '/membercard/defaultGrade',
    method: 'get'
  })
}
