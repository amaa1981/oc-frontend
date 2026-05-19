/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-26 17:44:56
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-26 17:45:14
 */
import request from '@/utils/request'

// 查询播放音频配置列表
export function listConfig(query) {
  return request({
    url: '/api/audio/config',
    method: 'get',
    params: query
  })
}

// 查询播放音频配置详细
export function getConfig(id) {
  return request({
    url: '/api/audio/config/' + id,
    method: 'get'
  })
}

// 新增播放音频配置
export function addConfig(data) {
  return request({
    url: '/api/audio/config',
    method: 'post',
    data: data
  })
}

// 修改播放音频配置
export function updateConfig(data) {
  return request({
    url: '/api/audio/config',
    method: 'put',
    data: data
  })
}

// 删除播放音频配置
export function delConfig(id) {
  return request({
    url: '/api/audio/config/' + id,
    method: 'delete'
  })
}
