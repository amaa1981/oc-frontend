import request from '@/utils/request'

// 根据id获取数据
export function getPublicAccountConfig(id) {
  return request({
    url: '/api/push/service/config/'+ id,
    method: 'get'
  })
}
// 接口 --- 修改公众号消息推送配置
export function editPublicAccountConfig(data) {
    return request({
      url: '/api/push/service/config',
      method: 'put',
      data
    })
  }
