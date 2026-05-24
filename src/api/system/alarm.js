/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-16 09:39:44
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-21 15:49:06
 */
import request from '@/utils/request'

// Query to clear alarm record configuration List
export function listConfig(query) {
  return request({
    url: '/alarm/config',
    method: 'get',
    params: query
  })
}

// Query clear alarm record configuration details
export function getConfig(id) {
  return request({
    url: '/sysConfig/' + id,
    method: 'get'
  })
}

// Added clearing alarm record configuration
export function addConfig(data) {
  return request({
    url: '/alarm/config',
    method: 'post',
    data: data
  })
}

// Edit clear alarm record configuration
export function updateConfig(data) {
  return request({
    url: '/sysConfig',
    method: 'put',
    data: data
  })
}

// Delete clears alarm record configuration
export function delConfig(id) {
  return request({
    url: '/alarm/config/' + id,
    method: 'delete'
  })
}
