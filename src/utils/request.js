
import axios from 'axios'
import store from '@/store/index'
import router from '../router/index'
import JSONbig from 'json-bigint'
const baseURL = 'http://139.9.143.69:8002/'
const request = axios.create({
  baseURL,
  timeout: 10000,
  // 预防解决后端返回的数字大小超过js的number范围
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
})
// 请求拦截器
request.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = store.state.token
    token && (config.headers.adminuid = token)

    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
request.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
          window.sessionStorage.clear()
          break
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          // 1.提示token过期
          // 2.清除本地存储的token
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          // setTimeout(() => {
          //   router.replace({
          //     path: '/login',
          //     query: {
          //       redirect: router.currentRoute.fullPath
          //     }
          //   })
          // }, 1000)
          break
        // 404请求不存在
        case 404:
          // 1. 提示请求不存在
          break
        // 其他错误，直接抛出错误提示
        default:
        // Toast({
        //   message: error.response.data.message,
        //   duration: 1500,
        //   forbidClick: true
        // })
      }
      return Promise.reject(error.response)
    }
  }
)
export default request
