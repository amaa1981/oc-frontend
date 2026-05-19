/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-08 16:23:57
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-08 16:56:45
 */
import request from '@/utils/request'

// 查询mqtt推送配置列表
export function listConfig(query) {
  return request({
    url: '/api/mqtt/push',
    method: 'get',
    params: query
  })
}

// 查询mqtt推送配置详细
export function getConfig(id) {
  return request({
    url: '/api/mqtt/push/' + id,
    method: 'get'
  })
}

// 新增mqtt推送配置
export function addConfig(data) {
  return request({
    url: '/api/mqtt/push',
    method: 'post',
    data: data
  })
}

// 修改mqtt推送配置
export function updateConfig(data) {
  return request({
    url: '/api/mqtt/push',
    method: 'put',
    data: data
  })
}

// 删除mqtt推送配置
export function delConfig(id) {
  return request({
    url: '/api/mqtt/push/' + id,
    method: 'delete'
  })
}
