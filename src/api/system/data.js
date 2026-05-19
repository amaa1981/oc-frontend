/*
 * @Author: FGJ
 * @Date: 2025-05-22 11:16:50
 * @Descripttion: 
 * @LastEditTime: 2025-07-08 09:46:23
 * @LastEditors: FGJ
 * @version: 
 */
import request from '@/utils/request'
// 事件预警趋势图
export function getTrendChart(query) {
  return request({
    url: '/cockpit/getTrendChart',
    method: 'get',
    params: query
  })
}


// 今日概况
export function getTodayOverview(query) {
  return request({
    url: '/cockpit/getTrendChart',
    method: 'get',
    params: query
  })
}
//设备事件预警趋势图
export function getDeviceTrendChart(query) {
  return request({
    url: '/cockpit/getTrendChart',
    method: 'get',
    params: query
  })
}
//统计时间范围内的人数和车数量
export function getVehiclesNumber(query) {
  return request({
    url: '/cockpit/getTrendChart',
    method: 'get',
    params: query
  })
}
//人车事件预警趋势图
export function getVehiclesMap(query) {
  return request({
    url: '/cockpit/getTrendChart',
    method: 'get',
    params: query
  })
}


