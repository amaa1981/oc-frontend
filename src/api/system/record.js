/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-08 10:09:15
 * @LastEditors: FGJ
 * @LastEditTime: 2025-05-13 10:53:50
 */
import request from '@/utils/request'

// Query alarm record information list
export function listRecord(query) {
  return request({
    url: '/alarm/record',
    method: 'get',
    params: query
  })
}

// Query alarm record information details
export function getRecord(id) {
  return request({
    url: '/alarm/record/' + id,
    method: 'get'
  })
}

// Add alarm record
export function addRecord(data) {
  return request({
    url: '/alarm/record',
    method: 'post',
    data: data
  })
}

// Edit alarm record information
export function updateRecord(data) {
  return request({
    url: '/alarm/record',
    method: 'put',
    data: data
  })
}

// Delete alarm record information
export function delRecord(id) {
  return request({
    url: '/alarm/record/' + id,
    method: 'delete'
  })
}
