/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-26 17:44:56
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-26 17:45:14
 */
import request from '@/utils/request'

// Query plays Audio configuration List
export function listConfig(query) {
  return request({
    url: '/audio/config',
    method: 'get',
    params: query
  })
}

// Query play Audio configuration details
export function getConfig(id) {
  return request({
    url: '/audio/config/' + id,
    method: 'get'
  })
}

// Added playback Audio configuration
export function addConfig(data) {
  return request({
    url: '/audio/config',
    method: 'post',
    data: data
  })
}

// Edit play Audio configuration
export function updateConfig(data) {
  return request({
    url: '/audio/config',
    method: 'put',
    data: data
  })
}

// Delete playAudio configuration
export function delConfig(id) {
  return request({
    url: '/audio/config/' + id,
    method: 'delete'
  })
}
