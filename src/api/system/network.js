import request from '@/utils/request'

// Query network configuration information List
export function listConfig(query) {
  return request({
    url: '/api/network/config',
    method: 'get',
    params: query
  })
}

// Query network configuration information details
export function getConfig(id) {
  return request({
    url: '/api/network/config/' + id,
    method: 'get'
  })
}

// Add network configuration information
export function addConfig(data) {
  return request({
    url: '/api/network/config',
    method: 'post',
    data: data
  })
}

// EditNetwork configuration information
export function updateConfig(data) {
  return request({
    url: '/api/network/config',
    method: 'put',
    data: data
  })
}

// Delete network configuration information
export function delConfig(id) {
  return request({
    url: '/api/network/config/' + id,
    method: 'delete'
  })
}
