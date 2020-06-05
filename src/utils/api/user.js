/**
 * 用户相关的接口
 */
import http from "../axios";

// 登录获取token
export function login(data) {
  return http.post('/user/login', data)
}