/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-16 09:31:23
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-16 09:33:48
 */
import request from '@/utils/request'

// 查询服务安装包信息列表
export function listInfo(query) {
  return request({
    url: '/api/service/update',
    method: 'get',
    params: query
  })
}

// 查询服务安装包信息详细
export function getInfo(id) {
  return request({
    url: '/api/service/update/' + id,
    method: 'get'
  })
}

// 获取最新的服务安装包信息
export function getInfonew() {
  return request({
    url: '/api/service/update/new',
    method: 'get'
  })
}

// 新增服务安装包信息
export function addInfo(data) {
  return request({
    url: '/api/service/update',
    method: 'post',
    data: data
  })
}

// 修改服务安装包信息
export function updateInfo(data) {
  return request({
    url: '/api/service/update',
    method: 'put',
    data: data
  })
}

// 删除服务安装包信息
export function delInfo(id) {
  return request({
    url: '/api/service/update/' + id,
    method: 'delete'
  })
}
