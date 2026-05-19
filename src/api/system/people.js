/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-05-30 13:57:18
 * @LastEditors: FGJ
 * @LastEditTime: 2023-05-30 13:57:33
 */
import request from '@/utils/request'

// 查询人员信息列表
export function listPeople(query) {
  return request({
    url: '/api/people',
    method: 'get',
    params: query
  })
}

// 查询人员信息详细
export function getPeople(id) {
  return request({
    url: '/api/people/' + id,
    method: 'get'
  })
}

// 新增人员信息
export function addPeople(data) {
  return request({
    url: '/api/people',
    method: 'post',
    data: data
  })
}

// 修改人员信息
export function updatePeople(data) {
  return request({
    url: '/api/people',
    method: 'put',
    data: data
  })
}

// 删除人员信息
export function delPeople(id) {
  return request({
    url: '/api/people/' + id,
    method: 'delete'
  })
}
