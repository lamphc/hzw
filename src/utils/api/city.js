/**
 * 城市相关的接口
 */
import http from "../axios";

// 获取当前定位城市的详细信息
export function getCurrCity(name) {
  return http.get('/area/info', {
    params: {
      name
    }
  })
}

// 获取城市列表
export function getCityList(level = 1) {
  return http.get('/area/city', {
    params: {
      level
    }
  })
}