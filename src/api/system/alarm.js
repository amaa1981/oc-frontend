/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-16 09:39:44
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-21 15:49:06
 */
import request from '@/utils/request'

// 查询清理告警记录配置列表
export function listConfig(query) {
  return request({
    url: '/alarm/config',
    method: 'get',
    params: query
  })
}

// 查询清理告警记录配置详细
export function getConfig(id) {
  return request({
    url: '/sysConfig/' + id,
    method: 'get'
  })
}

// 新增清理告警记录配置
export function addConfig(data) {
  return request({
    url: '/alarm/config',
    method: 'post',
    data: data
  })
}

// 修改清理告警记录配置
export function updateConfig(data) {
  return request({
    url: '/sysConfig',
    method: 'put',
    data: data
  })
}

// 删除清理告警记录配置
export function delConfig(id) {
  return request({
    url: '/alarm/config/' + id,
    method: 'delete'
  })
}
