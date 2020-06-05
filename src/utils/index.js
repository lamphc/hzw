/**
 * 全局公共的方法
 */
import { getCurrCity } from './api/city';


// 定义token=》key
const HZW_TOKEN = 'hzw_token';

// 封装本地存储方法
// 存储本地数据
export function setLocalData(key, val) {
  localStorage.setItem(key, val)
}
// 获取本地数据
export function getLocalData(key) {
  return localStorage.getItem(key)
}

// 删除本地数据
export function delLocalData(key) {
  localStorage.removeItem(key)
}



// 业务需求：
// 1. 如果没有本地数据->利用百度地图API获取当前城市->发送请求**获取城市详细信息**->并保存本地数据->Promise返回城市数据
// 2. 如果有本地数据->直接Promise.resolve(数据)返回
// 存储定位信息的key
const CURR_CITY = 'curr_city';
// 返回Promise对象形式 =》包含定位城市的数据
export function getCity() {
  // 先从本地获取定位信息
  const currCity = JSON.parse(getLocalData(CURR_CITY))
  if (!currCity) {
    // 没有获取到
    return new Promise((reslove, reject) => {
      // 解构BMap地图方法对象
      const { BMap } = window;
      // 回调函数：获取数据
      // 根据上网的IP，定位当前城市
      // 初始化LocalCity=》定位实例
      const myCity = new BMap.LocalCity();
      myCity.get(async (result) => {
        const cityName = result.name;
        console.log("当前定位城市:" + cityName);
        // 调用后台接口=》获取当前定位城市的详细信息
        const { status, data } = await getCurrCity(cityName);
        // console.log(res)
        if (status === 200) {
          // 存储到本地
          setLocalData(CURR_CITY, JSON.stringify(data))
          // 外部调用=》拿到的结果/数据
          reslove(data)
        } else {
          reject('error')
        }
      });
    })
  } else {
    // 获取到
    return Promise.resolve(currCity)
  }
}

export { CURR_CITY, HZW_TOKEN }

/**
 * 前端本地存储有哪些方式？这些方式有什么不同？
 * 1. localStorage：* 一直存在（除非用户手动清除）* 5M
 * 2. sessionStorage：* 页面关闭数据就没了 * 5M
 * 3. cookie(不推荐)：* 4k * 服务器生成的，可以设置过期时间 * 不安全
 * 4. indexDB：* 一直存在（除非用户手动清除）* 无限制
 */







