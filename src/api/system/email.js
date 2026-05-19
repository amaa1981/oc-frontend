import request from '@/utils/request'

// 查询邮箱推送配置列表
export function listEmailPush(query) {
  return request({
    url: '/api/email/push',
    method: 'get',
    params: query
  })
}

// 查询邮箱推送配置详细
export function getEmailPush(id) {
  return request({
    url: '/api/email/push/' + id,
    method: 'get'
  })
}

// 新增邮箱推送配置
export function addEmailPush(data) {
  return request({
    url: '/api/email/push',
    method: 'post',
    data: data
  })
}

// 修改邮箱推送配置
export function updateEmailPush(data) {
  return request({
    url: '/api/email/push',
    method: 'put',
    data: data
  })
}

// 删除邮箱推送配置
export function delEmailPush(ids) {
  return request({
    url: '/api/email/push/' + ids,
    method: 'delete'
  })
}
