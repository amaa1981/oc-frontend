import request from '@/utils/request'

// Get data based on id
export function getPublicAccountConfig(id) {
  return request({
    url: '/api/push/service/config/'+ id,
    method: 'get'
  })
}
// Interface --- Edit public account message push configuration
export function editPublicAccountConfig(data) {
    return request({
      url: '/api/push/service/config',
      method: 'put',
      data
    })
  }
