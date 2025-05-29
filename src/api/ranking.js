import fetch from '@/utils/fetch'

export function getRankingInfo(id) {
    return fetch({
        url: `/goods/ranking/${id}`,
        method: 'get'
    })
}

export function addRanking(query) {
    return fetch({
        url: '/goods/ranking',
        method: 'post',
        params: query
    })
}

export function updateRanking(id, query) {
    return fetch({
        url: `/goods/ranking/${id}`,
        method: 'put',
        params: query
    })
}

export function deleteRanking(id) {
    return fetch({
        url: `/goods/ranking/${id}`,
        method: 'delete'
    })
}