/*
 * @Author: FGJ
 * @Date: 2025-05-13 09:40:34
 * @Descripttion: 
 * @LastEditTime: 2025-05-13 16:29:14
 * @LastEditors: FGJ
 * @version: 
 */
import request from '@/utils/request'

// Query access control device information list
export function listControl(query) {
  return request({
    url: '/api/access/control',
    method: 'get',
    params: query
  })
}

// Query access control device information details
export function getControl(id) {
  return request({
    url: '/api/access/control/' + id,
    method: 'get'
  })
}

// Add access control equipment information
export function addControl(data) {
  return request({
    url: '/api/access/control',
    method: 'post',
    data: data
  })
}

// Edit access control device information
export function updateControl(data) {
  return request({
    url: '/api/access/control',
    method: 'put',
    data: data
  })
}

// Delete access control device information
export function delControl(id) {
  return request({
    url: '/api/access/control/' + id,
    method: 'delete'
  })
}

// Operate access control equipment
export function operate(data) {
  return request({
    url: '/api/access/control/operate',
    method: 'post',
    data: data
  })
}

