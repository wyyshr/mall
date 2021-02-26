// 我是乱封装的啊 😏，不好的地方你可以自己改改   (ง •_•)ง

import axios from 'axios'
import { ElMessage } from 'element-plus'

export const host = "http://localhost:3000"

/** 请求路径 */
const PATH = {
  mobJson: '/mob-json',

  login:        '/user/login',
  register:     '/user/register',
  setAddress:   '/user/setAddress',
  getAddress:   '/user/getAddress',

  upload:       '/mobile/upload',
  addMob:       '/mobile/add',
  delMob:       '/mobile/del',
  getMob:       '/mobile/get',
  addCart:      '/mobile/addCart',
  getCart:      '/mobile/getCart',
  delCart:      '/mobile/delCart',
  pay:          '/mobile/pay',
  setNum:       '/mobile/setNum',
  getOrder:     '/mobile/getOrder',
  receive:      '/mobile/receive',
}

const ajax = axios.create({
  baseURL: host,
  timeout: 10000
})

// ajax.interceptors.request.use(config => {
//   return config
// }, err => {
//   console.log(err);
// })

ajax.interceptors.response.use(res => {
  const { data: { msg = '', msgType = '' } } = res
  msg && ElMessage({ message: msg, type: msgType })
  return res.data
}, err => {
  console.error('ajax error: ', err);
  ElMessage.error('网络异常.');
  if (err.response.status === 500) {
    window.location.href = '/login';
  }
})

/**
 * 防止混淆`get`和`post`的传参格式 😕\
 * `ajax.get/post(path, {key: value, key: value})`
 */
const AJAX = {
  /**
 * GET 请求
 * @param url 请求路径
 * @param params 请求参数：{ }
 */
  get: (url, params) => ajax.get(url, { params }),
  /**
 * POST 请求
 * @param url 请求路径
 * @param data 请求参数：{ }
 */
  post: (url, data) => ajax.post(url, data),
  /**
 * PUT 请求
 * @param url 请求路径
 * @param data 请求参数：{ }
 */
  put: (url, data) => ajax.put(url, data),
  /**
 * DELETE 请求
 * @param url 请求路径
 * @param data 请求参数：{ }
 */
  delete: (url, data) => ajax.delete(url, { data })
}

export { ajax, AJAX, PATH }