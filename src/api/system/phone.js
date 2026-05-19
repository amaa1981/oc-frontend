import request from '@/utils/request'

// 查询手机推送配置列表
export function listPhonePush(query) {
  return request({
    url: '/api/phone/push',
    method: 'get',
    params: query
  })
}

// 查询手机推送配置详细
export function getPhonePush(id) {
  return request({
    url: '/api/phone/push/' + id,
    method: 'get'
  })
}

// 新增手机推送配置
export function addPhonePush(data) {
  return request({
    url: '/api/phone/push',
    method: 'post',
    data: data
  })
}

// 修改手机推送配置
export function updatePhonePush(data) {
  return request({
    url: '/api/phone/push',
    method: 'put',
    data: data
  })
}

// 删除手机推送配置
export function delPhonePush(ids) {
  return request({
    url: '/api/phone/push/' + ids,
    method: 'delete'
  })
}
