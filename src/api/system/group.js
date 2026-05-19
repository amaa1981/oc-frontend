/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-02 15:16:51
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-02 15:25:54
 */
import request from '@/utils/request'

// 查询人脸库信息列表
export function listGroup(query) {
  return request({
    url: '/api/peopleGroup',
    method: 'get',
    params: query
  })
}

// 查询人脸库信息详细
export function getGroup(id) {
  return request({
    url: '/api/peopleGroup/' + id,
    method: 'get'
  })
}

// 新增人脸库信息
export function addGroup(data) {
  return request({
    url: '/api/peopleGroup',
    method: 'post',
    data: data
  })
}

// 修改人脸库信息
export function updateGroup(data) {
  return request({
    url: '/api/peopleGroup',
    method: 'put',
    data: data
  })
}

// 删除人脸库信息
export function delGroup(id) {
  return request({
    url: '/api/peopleGroup/' + id,
    method: 'delete'
  })
}
