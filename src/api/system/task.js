/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-06 14:08:00
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-06 14:10:26
 */
import request from '@/utils/request'

// 查询设备任务信息列表
export function listTask(query) {
  return request({
    url: '/api/deviceTask',
    method: 'get',
    params: query
  })
}

// 查询设备任务信息详细
export function getTask(id) {
  return request({
    url: '/api/deviceTask/' + id,
    method: 'get'
  })
}

// 新增设备任务信息
export function addTask(data) {
  return request({
    url: '/api/deviceTask',
    method: 'post',
    data: data
  })
}

// 修改设备任务信息
export function updateTask(data) {
  return request({
    url: '/api/deviceTask',
    method: 'put',
    data: data
  })
}

// 删除设备任务信息
export function delTask(id) {
  return request({
    url: '/api/deviceTask/' + id,
    method: 'delete'
  })
}
