/*
 * @Author: NULL 1628069508@qq.com
 * @Date: 2023-06-16 10:42:02
 * @LastEditTime: 2025-05-29 16:36:39
 * @LastEditors: FGJ
 * @Description: 进程管理相关接口
 * @FilePath: \ruoyi-ui\src\api\system\processManage.js
 */
import request from '@/utils/request'
// 查询分析服务器进程信息
export function getProcessInfo(query) {
  return request({
    url: '/api/manageConfig/analysis/getProcessInfo',
    method: 'get',
    params: query
  })
}
// 重启分析服务器进程
export function restartProcess(query) {
  return request({
    url: '/api/manageConfig/analysis/restartProcess',
    method: 'get',
    params: query
  })
}
// 查询流媒体服务器进程信息
export function getMediaProcessInfo(query) {
  return request({
    url: '/api/manageConfig/media/getProcessInfo',
    method: 'get',
    params: query
  })
}
// 重启流媒体服务器进程
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

