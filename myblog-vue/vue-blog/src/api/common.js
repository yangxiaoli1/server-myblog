import axios from 'axios'
import store from 'store'
import base from '@/config/base.config'

const { TIMEOUT, TOKEN_NAME } = base
console.log(process.env.VUE_APP_BASE_URL)
//全局 axios 默认值 将作用于每个请求
// axios.defaults.baseURL = BASE_URL
let service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: TIMEOUT
})
// 添加请求拦截器
service.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  let token = store.get(TOKEN_NAME)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么  剥离最外层
  let result = response.data
  return result?.data
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default service
