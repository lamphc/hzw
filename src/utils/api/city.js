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

// 获取热门城市
export function getHotCity() {
  return http.get('/area/hot')
}


// 根据当前城市ID和关键词查询小区
export function getCommunityByKey(id, name) {
  return http.get('/area/community', {
    params: {
      id, name
    }
  })
}