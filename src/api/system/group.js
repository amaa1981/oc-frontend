/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-02 15:16:51
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-02 15:25:54
 */
import request from '@/utils/request'

// Query face database information list
export function listGroup(query) {
  return request({
    url: '/api/peopleGroup',
    method: 'get',
    params: query
  })
}

// Query face database information details
export function getGroup(id) {
  return request({
    url: '/api/peopleGroup/' + id,
    method: 'get'
  })
}

// Add face database information
export function addGroup(data) {
  return request({
    url: '/api/peopleGroup',
    method: 'post',
    data: data
  })
}

// Edit face database information
export function updateGroup(data) {
  return request({
    url: '/api/peopleGroup',
    method: 'put',
    data: data
  })
}

// Delete face database information
export function delGroup(id) {
  return request({
    url: '/api/peopleGroup/' + id,
    method: 'delete'
  })
}
