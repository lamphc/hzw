/**
 * 用户相关的接口
 */
import http from "../axios";

// 登录获取token
export function login(data) {
  return http.post('/user/login', data)
}

// 登录当前登录人信息
export function getUser() {
  return http.get('/user')
}

// 退出登录
export function logout() {
  return http.post('/user/logout')
}