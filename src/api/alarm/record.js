import request from '@/utils/request'

// 获取商店客流统计分页列表
export function getShopCountPage(query) {
    return request({
        url: '/api/alarm/record/shopCountPage',
        method: 'get',
        params: query
    })
}

// 获取今日客流统计
export function getShopCountToday(query) {
    return request({
        url: '/api/alarm/record/shopCountToday',
        method: 'get',
        params: query
    })
}

// 获取轨迹查询分页列表
export function trajectoryPage(query) {
    return request({
        url: '/api/alarm/record/trajectoryPage',
        method: 'get',
        params: query
    })
}

// 获取轨迹详情
export function getTrajectory(query) {
    return request({
        url: '/api/alarm/record/getTrajectory',
        method: 'get',
        params: query
    })
}

// 导出商店客流统计数据
export function exportShopCount(query) {
    return request({
        url: '/api/alarm/record/shopCount/export',
        method: 'get',
        params: query,
        responseType: 'blob'
    })
}

// 获取记录查询数据
export function getRecordList(query) {
    return request({
        url: '/api/alarm/record',
        method: 'get',
        params: query
    })
}

// 删除轨迹数据
export function delTrajectory(query) {
    return request({
        url: '/api/alarm/record/delTrajectory',
        method: 'get',
        params: query
    })
}