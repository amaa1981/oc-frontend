/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-05-26 16:44:56
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-28 09:36:00
 */
import request from '@/utils/request'

// Query device information list
export function listDevice(query) {
  return request({
    url: '/device',
    method: 'get',
    params: query
  })
}
export function listDeviceAll(query) {
  return request({
    url: '/device/queryAll',
    method: 'get',
    params: query
  })
}
// Query device information details
export function getDevice(id) {
  return request({
    url: '/device/' + id,
    method: 'get'
  })
}

// Add device
export function addDevice(data) {
  return request({
    url: '/device',
    method: 'post',
    data: data
  })
}

// Edit device information
export function updateDevice(data) {
  return request({
    url: '/device',
    method: 'put',
    data: data
  })
}

// Delete device information
export function delDevice(id) {
  return request({
    url: '/device/' + id,
    method: 'delete'
  })
}

//Audio status master switch 10 on 20 off status
export function audioStatus(status) {
  return request({
    url: '/device/taskStatus/audioStatus?status=' + status,
    method: 'get'
  })
}

export function getAudioStatus() {
  return request({
    url: '/device/taskStatus/getAudioStatus',
    method: 'get'
  })
}

