/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-05-26 16:44:56
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-28 09:36:00
 */
import request from '@/utils/request'

// 查询设备信息列表
export function listDevice(query) {
  return request({
    url: '/api/device',
    method: 'get',
    params: query
  })
}
export function listDeviceAll(query) {
  return request({
    url: '/api/device/queryAll',
    method: 'get',
    params: query
  })
}
// 查询设备信息详细
export function getDevice(id) {
  return request({
    url: '/api/device/' + id,
    method: 'get'
  })
}

// 新增设备信息
export function addDevice(data) {
  return request({
    url: '/api/device',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateDevice(data) {
  return request({
    url: '/api/device',
    method: 'put',
    data: data
  })
}

// 删除设备信息
export function delDevice(id) {
  return request({
    url: '/api/device/' + id,
    method: 'delete'
  })
}

//音频状态总开关 10 开 20 关 status
export function audioStatus(status) {
  return request({
    url: '/api/deviceTask/audioStatus?status=' + status,
    method: 'get'
  })
}

export function getAudioStatus() {
  return request({
    url: '/api/deviceTask/getAudioStatus',
    method: 'get'
  })
}

