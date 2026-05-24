/*
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-16 10:42:02
 * @LastEditTime: 2025-05-29 16:36:39
 * @LastEditors: FGJ
 * @Description: Process management related interfaces
 * @FilePath: \ruoyi-ui\src\api\system\processManage.js
 */
import request from '@/utils/request'
// Query analyzes server process information
export function getProcessInfo(query) {
  return request({
    url: '/api/manageConfig/analysis/getProcessInfo',
    method: 'get',
    params: query
  })
}
// Restart analysis server process
export function restartProcess(query) {
  return request({
    url: '/api/manageConfig/analysis/restartProcess',
    method: 'get',
    params: query
  })
}
// Query streaming server process information
export function getMediaProcessInfo(query) {
  return request({
    url: '/api/manageConfig/media/getProcessInfo',
    method: 'get',
    params: query
  })
}
// Restart streaming server process
export function restartMediaProcess(query) {
  return request({
    url: '/api/manageConfig/media/restartProcess',
    method: 'get',
    params: query
  })
}

export function reboot(data) {
  return request({
    url: '/api/network/config/reboot',
    method: 'post',
    data: data
  })
}

