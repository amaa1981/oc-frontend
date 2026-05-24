/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-06 14:08:00
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-06 14:10:26
 */
import request from '@/utils/request'

// Query device task information list
export function listTask(query) {
  return request({
    url: '/api/deviceTask',
    method: 'get',
    params: query
  })
}

// Query device task information details
export function getTask(id) {
  return request({
    url: '/api/deviceTask/' + id,
    method: 'get'
  })
}

// Add device task information
export function addTask(data) {
  return request({
    url: '/api/deviceTask',
    method: 'post',
    data: data
  })
}

// Edit device task information
export function updateTask(data) {
  return request({
    url: '/api/deviceTask',
    method: 'put',
    data: data
  })
}

// Delete device task information
export function delTask(id) {
  return request({
    url: '/api/deviceTask/' + id,
    method: 'delete'
  })
}
