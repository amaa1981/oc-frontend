/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-05-26 16:40:53
 * @LastEditors: FGJ
 * @LastEditTime: 2023-06-12 15:43:26
 */
import request from '@/utils/request'

// Query cache details
export function getCache() {
  return request({
    url: '/monitor/cache',
    method: 'get'
  })
}

// Query cache name List
export function listCacheName() {
  return request({
    url: '/monitor/cache/getNames',
    method: 'get'
  })
}

// Query cache key name List
export function listCacheKey(cacheName) {
  return request({
    url: '/monitor/cache/getKeys/' + cacheName,
    method: 'get'
  })
}

// Query cache content
export function getCacheValue(cacheName, cacheKey) {
  return request({
    url: '/monitor/cache/getValue/' + cacheName + '/' + cacheKey,
    method: 'get'
  })
}

// Clear cache of specified name
export function clearCacheName(cacheName) {
  return request({
    url: '/monitor/cache/clearCacheName/' + cacheName,
    method: 'delete'
  })
}

// Clear cache of specified key name
export function clearCacheKey(cacheKey) {
  return request({
    url: '/monitor/cache/clearCacheKey/' + cacheKey,
    method: 'delete'
  })
}

// Clear all cache
export function clearCacheAll() {
  return request({
    url: '/monitor/cache/clearCacheAll',
    method: 'delete'
  })
}
