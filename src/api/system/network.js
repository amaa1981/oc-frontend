import request from '@/utils/request'

// 查询网络配置信息列表
export function listConfig(query) {
  return request({
    url: '/api/network/config',
    method: 'get',
    params: query
  })
}

// 查询网络配置信息详细
export function getConfig(id) {
  return request({
    url: '/api/network/config/' + id,
    method: 'get'
  })
}

// 新增网络配置信息
export function addConfig(data) {
  return request({
    url: '/api/network/config',
    method: 'post',
    data: data
  })
}

// 修改网络配置信息
export function updateConfig(data) {
  return request({
    url: '/api/network/config',
    method: 'put',
    data: data
  })
}

// 删除网络配置信息
export function delConfig(id) {
  return request({
    url: '/api/network/config/' + id,
    method: 'delete'
  })
}
