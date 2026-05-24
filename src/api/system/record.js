/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-08 10:09:15
 * @LastEditors: FGJ
 * @LastEditTime: 2025-05-13 10:53:50
 */
import request from '@/utils/request'

// 查询告警记录信息列表
export function listRecord(query) {
  return request({
    url: '/alarm/record',
    method: 'get',
    params: query
  })
}

// 查询告警记录信息详细
export function getRecord(id) {
  return request({
    url: '/alarm/record/' + id,
    method: 'get'
  })
}

// 新增告警记录信息
export function addRecord(data) {
  return request({
    url: '/alarm/record',
    method: 'post',
    data: data
  })
}

// 修改告警记录信息
export function updateRecord(data) {
  return request({
    url: '/alarm/record',
    method: 'put',
    data: data
  })
}

// 删除告警记录信息
export function delRecord(id) {
  return request({
    url: '/alarm/record/' + id,
    method: 'delete'
  })
}
