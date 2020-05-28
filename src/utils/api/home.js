/**
 * 首页相关的接口
 */
import http from "../axios";

// 获取轮播图数据
export function getSwiper() {
  // 返回的是对象？=>Promise
  return http.get('/home/swiper')
}

// 获取租房小组数据
export function getGroup(area = 'AREA%7C88cff55c-aaa4-e2e0') {
  return http.get('/home/groups', {
    params: {
      area
    }
  })
}

// 获取新闻咨询
export function getNews(area = 'AREA%7C88cff55c-aaa4-e2e0') {
  return http.get('/home/news', {
    params: {
      area
    }
  })
}