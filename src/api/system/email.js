import request from '@/utils/request'

// Query mailbox push configuration list
export function listEmailPush(query) {
  return request({
    url: '/email/push',
    method: 'get',
    params: query
  })
}

// Query mailbox push configuration details
export function getEmailPush(id) {
  return request({
    url: '/email/push/' + id,
    method: 'get'
  })
}

// Added email push configuration
export function addEmailPush(data) {
  return request({
    url: '/email/push',
    method: 'post',
    data: data
  })
}

// Edit email push configuration
export function updateEmailPush(data) {
  return request({
    url: '/email/push',
    method: 'put',
    data: data
  })
}

// Delete mailbox push configuration
export function delEmailPush(ids) {
  return request({
    url: '/api/email/push/' + ids,
    method: 'delete'
  })
}
