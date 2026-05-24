/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-08 15:23:06
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-08 16:56:24
 */
import request from '@/utils/request'

// Queryhttp push configuration List
export function listConfig(query) {
  return request({
    url: '/api/http/push',
    method: 'get',
    params: query
  })
}

// Queryhttp push configuration details
export function getConfig(id) {
  return request({
    url: '/api/http/push/' + id,
    method: 'get'
  })
}

// Added http push configuration
export function addConfig(data) {
  return request({
    url: '/api/http/push',
    method: 'post',
    data: data
  })
}

// Edithttp push configuration
export function updateConfig(data) {
  return request({
    url: '/api/http/push',
    method: 'put',
    data: data
  })
}

// Deletehttp push configuration
export function delConfig(id) {
  return request({
    url: '/api/http/push/' + id,
    method: 'delete'
  })
}
