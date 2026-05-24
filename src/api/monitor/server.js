import request from '@/utils/request'

// Get service information
export function getServer() {
  return request({
    url: '/monitor/server',
    method: 'get'
  })
}