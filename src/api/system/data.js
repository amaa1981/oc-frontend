import request from '@/utils/request'

// Event Alarm Trend Chart (pie chart left)
export function getTrendChart(query) {
  return request({
    url: '/cockpit/getTrendChart',
    method: 'get',
    params: query
  })
}

// Today Overview (header stats)
export function getTodayOverview(query) {
  return request({
    url: '/cockpit/getTodayOverview',
    method: 'get',
    params: query
  })
}

// Device Trend Chart (bottom 3 devices)
export function getDeviceTrendChart(query) {
  return request({
    url: '/cockpit/getDeviceTrendChart',
    method: 'get',
    params: query
  })
}

// People and Vehicle count
export function getVehiclesNumber(query) {
  return request({
    url: '/cockpit/getVehiclesNumber',
    method: 'get',
    params: query
  })
}

// People and Vehicle trend chart
export function getVehiclesMap(query) {
  return request({
    url: '/cockpit/getVehicles',
    method: 'get',
    params: query
  })
}