import request from '@/utils/request'

// Get route
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}