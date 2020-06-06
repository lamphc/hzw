/**
 * 封装自己的axios
 */

import axios from 'axios'
import { Toast } from 'antd-mobile';
import { getToken } from '.';
// loading效果组件

// 请求基础地址
const BASE_URL = 'https://api-haoke-web.itheima.net'
// 创建axios实例
const myAxios = axios.create({
  baseURL: BASE_URL,
});

// 给myAxios加拦截器
// Add a request interceptor
// 请求之前触发
myAxios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // console.log('请求之前触发', config)
  // loading
  /**
   * 给需要在headers添加token接口
   */
  const { url, headers } = config, whiteList = ['/user/registered', '/user/login'];
  if (url.startsWith('/user') && !whiteList.includes(url)) {
    // 向headers里边加token验证
    headers.authorization = getToken()
  }

  Toast.loading('加载中...', 0);
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
// 请求成功之后
myAxios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // console.log('请求成功之后', response)
  Toast.hide()
  // close loading
  // 简化数据
  const data = response.data;
  // 咱们自己需要的数据
  let _res = {
    status: data.status,
    description: data.description,
    data: data.body
  }
  return _res;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});


export { BASE_URL }

export default myAxios