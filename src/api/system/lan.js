/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-16 09:39:44
 * @LastEditors: FGJ
 * @LastEditTime: 2023-07-13 13:46:06
 */
import request from '@/utils/request'

// 获取系统语言
export function getLocale() {
  return request({
    url: '/api/sysConfig/getLocale',
    method: 'get',
  })
}

// 设置系统语言
export function setLocale(locale) {
  return request({
    url: '/api/sysConfig/setLocale?locale=' + locale,
    method: 'get'
  })
}


// 获取java系统配置信息
export function getConfig() {
  return request({
    url: '/api/sysConfig/java',
    method: 'get'
  })
}

