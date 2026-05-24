/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-06-16 09:39:44
 * @LastEditors: FGJ
 * @LastEditTime: 2023-07-13 13:46:06
 */
import request from '@/utils/request'

// Get system locale
export function getLocale() {
  return request({
    url: '/sysConfig/getLocale',
    method: 'get',
  })
}

// Set system locale
export function setLocale(locale) {
  return request({
    url: '/sysConfig/setLocale?locale=' + locale,
    method: 'get'
  })
}


// Get Java system config
export function getConfig() {
  return request({
    url: '/sysConfig/java',
    method: 'get'
  })
}

