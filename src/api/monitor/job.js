import request from '@/utils/request'

// Query Scheduled Task Scheduling List
export function listJob(query) {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params: query
  })
}

// Query scheduled task scheduling details
export function getJob(jobId) {
  return request({
    url: '/monitor/job/' + jobId,
    method: 'get'
  })
}

// Add scheduled task scheduling
export function addJob(data) {
  return request({
    url: '/monitor/job',
    method: 'post',
    data: data
  })
}

// Edit scheduled task scheduling
export function updateJob(data) {
  return request({
    url: '/monitor/job',
    method: 'put',
    data: data
  })
}

// Delete scheduled task scheduling
export function delJob(jobId) {
  return request({
    url: '/monitor/job/' + jobId,
    method: 'delete'
  })
}

// Task statusEdit
export function changeJobStatus(jobId, status) {
  const data = {
    jobId,
    status
  }
  return request({
    url: '/monitor/job/changeStatus',
    method: 'put',
    data: data
  })
}


// Scheduled tasks are executed immediately
export function runJob(jobId, jobGroup) {
  const data = {
    jobId,
    jobGroup
  }
  return request({
    url: '/monitor/job/run',
    method: 'put',
    data: data
  })
}