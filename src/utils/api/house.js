/**
 * 房源相关的接口
 */
import http from "../axios";

// 获取房源筛选器条件数据
export function getFilterData(id) {
  return http.get('/houses/condition', {
    params: {
      id
    }
  })
}


