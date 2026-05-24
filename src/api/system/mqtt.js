/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-08 16:23:57
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-08 16:56:45
 */
import request from '@/utils/request'

// Querymqtt push configuration List
export function listConfig(query) {
  return request({
    url: '/mqtt/push',
    method: 'get',
    params: query
  })
}

// Querymqtt push configuration details
export function getConfig(id) {
  return request({
    url: '/mqtt/push/' + id,
    method: 'get'
  })
}

// Added mqtt push configuration
export function addConfig(data) {
  return request({
    url: '/mqtt/push',
    method: 'post',
    data: data
  })
}

// Editmqtt push configuration
export function updateConfig(data) {
  return request({
    url: '/mqtt/push',
    method: 'put',
    data: data
  })
}

// Deletemqtt push configuration
export function delConfig(id) {
  return request({
    url: '/mqtt/push/' + id,
    method: 'delete'
  })
}
