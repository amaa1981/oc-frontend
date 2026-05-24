/*
 * @Author: FGJ
 * @Date: 2025-05-13 10:53:32
 * @Descripttion: 
 * @LastEditTime: 2025-05-13 11:03:12
 * @LastEditors: FGJ
 * @version: 
 */
import request from '@/utils/request'

// Query access control operation record information list
export function listRecord(query) {
  return request({
    url: '/api/access/record',
    method: 'get',
    params: query
  })
}

// Query access control operation record information details
export function getRecord(id) {
  return request({
    url: '/api/access/record/' + id,
    method: 'get'
  })
}

// Added access control operation record information
export function addRecord(data) {
  return request({
    url: '/api/access/record',
    method: 'post',
    data: data
  })
}

// Edit access control operation record information
export function updateRecord(data) {
  return request({
    url: '/api/access/record',
    method: 'put',
    data: data
  })
}

// Delete access control operation record information
export function delRecord(id) {
  return request({
    url: '/api/access/record/' + id,
    method: 'delete'
  })
}
