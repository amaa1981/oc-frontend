import request from '@/utils/request'

// Get the pagination list of store customer flow statistics
export function getShopCountPage(query) {
    return request({
        url: '/api/alarm/record/shopCountPage',
        method: 'get',
        params: query
    })
}

// Get today’s passenger flow statistics
export function getShopCountToday(query) {
    return request({
        url: '/api/alarm/record/shopCountToday',
        method: 'get',
        params: query
    })
}

// Get the track Query paging List
export function trajectoryPage(query) {
    return request({
        url: '/api/alarm/record/trajectoryPage',
        method: 'get',
        params: query
    })
}

// Get track details
export function getTrajectory(query) {
    return request({
        url: '/api/alarm/record/getTrajectory',
        method: 'get',
        params: query
    })
}

// Export store traffic statistics
export function exportShopCount(query) {
    return request({
        url: '/api/alarm/record/shopCount/export',
        method: 'get',
        params: query,
        responseType: 'blob'
    })
}

// Get record Query data
export function getRecordList(query) {
    return request({
        url: '/api/alarm/record',
        method: 'get',
        params: query
    })
}

// Delete trajectory data
export function delTrajectory(query) {
    return request({
        url: '/api/alarm/record/delTrajectory',
        method: 'get',
        params: query
    })
}