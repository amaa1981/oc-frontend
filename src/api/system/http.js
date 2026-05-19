/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-08 15:23:06
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-08 16:56:24
 */
import request from '@/utils/request'

// 查询http推送配置列表
export function listConfig(query) {
  return request({
    url: '/api/http/push',
    method: 'get',
    params: query
  })
}

// 查询http推送配置详细
export function getConfig(id) {
  return request({
    url: '/api/http/push/' + id,
    method: 'get'
  })
}

// 新增http推送配置
export function addConfig(data) {
  return request({
    url: '/api/http/push',
    method: 'post',
    data: data
  })
}

// 修改http推送配置
export function updateConfig(data) {
  return request({
    url: '/api/http/push',
    method: 'put',
    data: data
  })
}

// 删除http推送配置
export function delConfig(id) {
  return request({
    url: '/api/http/push/' + id,
    method: 'delete'
  })
}
