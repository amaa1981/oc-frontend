import request from '@/utils/request'

// Query mobile phone push configuration List
export function listPhonePush(query) {
  return request({
    url: '/phone/push',
    method: 'get',
    params: query
  })
}

// Query mobile push configuration details
export function getPhonePush(id) {
  return request({
    url: '/phone/push/' + id,
    method: 'get'
  })
}

// Added mobile push configuration
export function addPhonePush(data) {
  return request({
    url: '/phone/push',
    method: 'post',
    data: data
  })
}

// Edit mobile push configuration
export function updatePhonePush(data) {
  return request({
    url: '/phone/push',
    method: 'put',
    data: data
  })
}

// Delete mobile push configuration
export function delPhonePush(ids) {
  return request({
    url: '/api/phone/push/' + ids,
    method: 'delete'
  })
}
