/*
 * @Author: FGJ
 * @Date: 2025-05-13 10:53:32
 * @Descripttion: 
 * @LastEditTime: 2025-05-13 11:03:12
 * @LastEditors: FGJ
 * @version: 
 */
import request from '@/utils/request'

// 查询门禁操作记录信息列表
export function listRecord(query) {
  return request({
    url: '/api/access/record',
    method: 'get',
    params: query
  })
}

// 查询门禁操作记录信息详细
export function getRecord(id) {
  return request({
    url: '/api/access/record/' + id,
    method: 'get'
  })
}

// 新增门禁操作记录信息
export function addRecord(data) {
  return request({
    url: '/api/access/record',
    method: 'post',
    data: data
  })
}

// 修改门禁操作记录信息
export function updateRecord(data) {
  return request({
    url: '/api/access/record',
    method: 'put',
    data: data
  })
}

// 删除门禁操作记录信息
export function delRecord(id) {
  return request({
    url: '/api/access/record/' + id,
    method: 'delete'
  })
}
