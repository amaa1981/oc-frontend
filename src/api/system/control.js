/*
 * @Author: FGJ
 * @Date: 2025-05-13 09:40:34
 * @Descripttion: 
 * @LastEditTime: 2025-05-13 16:29:14
 * @LastEditors: FGJ
 * @version: 
 */
import request from '@/utils/request'

// 查询门禁设备信息列表
export function listControl(query) {
  return request({
    url: '/api/access/control',
    method: 'get',
    params: query
  })
}

// 查询门禁设备信息详细
export function getControl(id) {
  return request({
    url: '/api/access/control/' + id,
    method: 'get'
  })
}

// 新增门禁设备信息
export function addControl(data) {
  return request({
    url: '/api/access/control',
    method: 'post',
    data: data
  })
}

// 修改门禁设备信息
export function updateControl(data) {
  return request({
    url: '/api/access/control',
    method: 'put',
    data: data
  })
}

// 删除门禁设备信息
export function delControl(id) {
  return request({
    url: '/api/access/control/' + id,
    method: 'delete'
  })
}

// 操作门禁设备
export function operate(data) {
  return request({
    url: '/api/access/control/operate',
    method: 'post',
    data: data
  })
}

