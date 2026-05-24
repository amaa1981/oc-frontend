/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-16 09:31:23
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-16 09:33:48
 */
import request from '@/utils/request'

// Query service installation package information list
export function listInfo(query) {
  return request({
    url: '/service/update',
    method: 'get',
    params: query
  })
}

// Query service installation package information details
export function getInfo(id) {
  return request({
    url: '/service/update/' + id,
    method: 'get'
  })
}

// Get the latest service installation package information
export function getInfonew() {
  return request({
    url: '/service/update/new',
    method: 'get'
  })
}

// Added service installation package information
export function addInfo(data) {
  return request({
    url: '/service/update',
    method: 'post',
    data: data
  })
}

// Edit service installation package information
export function updateInfo(data) {
  return request({
    url: '/service/update',
    method: 'put',
    data: data
  })
}

// Delete service installation package information
export function delInfo(id) {
  return request({
    url: '/service/update/' + id,
    method: 'delete'
  })
}
