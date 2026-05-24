import request from '@/utils/request'

export function listArea(query) {
  return request({
    url: '/area',
    method: 'get',
    params: query
  })
}

export function getArea(dictCode) {
  return request({
    url: '/area/' + dictCode,
    method: 'get'
  })
}

export function addArea(data) {
  return request({
    url: '/area',
    method: 'post',
    data: data
  })
}

export function updateArea(data) {
  return request({
    url: '/area',
    method: 'put',
    data: data
  })
}

export function delArea(dictCode) {
  return request({
    url: '/area/' + dictCode,
    method: 'delete'
  })
}
