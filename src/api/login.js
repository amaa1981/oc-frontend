import request from '@/utils/request'

// Login
export function login(username, password, code, uuid) {
  const data = { username, password, code, uuid }
  return request({
    url: '/auth/login',
    headers: { isToken: false },
    method: 'post',
    data: data
  })
}

// Get user info
export function getInfo() {
  return request({
    url: '/auth/info',
    method: 'get'
  })
}

// Logout
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// Get captcha image
export function getCodeImg() {
  return request({
    url: '/auth/captchaImage',
    headers: { isToken: false },
    method: 'get',
    timeout: 20000
  })
}