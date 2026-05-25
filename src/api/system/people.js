/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-05-30 13:57:18
 * @LastEditors: FGJ
 * @LastEditTime: 2023-05-30 13:57:33
 */
import request from '@/utils/request'

// QueryPersonnel Information List
export function listPeople(query) {
  return request({
    url: '/people',
    method: 'get',
    params: query
  })
}

// Query personnel information details
export function getPeople(id) {
  return request({
    url: '/people/' + id,
    method: 'get'
  })
}

// Add new personnel information
export function addPeople(data) {
  return request({
    url: '/people',
    method: 'post',
    data: data
  })
}

// Edit personnel information
export function updatePeople(data) {
  return request({
    url: '/people',
    method: 'put',
    data: data
  })
}

// Delete personnel information
export function delPeople(id) {
  return request({
    url: '/people/' + id,
    method: 'delete'
  })
}
