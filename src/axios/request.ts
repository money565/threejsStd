import axios from 'axios'
import { baseURL, loginURL } from '../webConfig'
// import { Base64 } from "js-base64"
export const request = axios.create({
  baseURL,
  responseType: 'json',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 300000,
})

export const requestNoLogin = axios.create({
  baseURL,
  responseType: 'json',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 300000,
})

export const requestLogin = axios.create({
  baseURL: loginURL,
  responseType: 'json',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 300000,
})

request.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(new Error(error))
})

request.interceptors.response.use((res) => {
  const status = res.data.code || 200
  const message = res.data.msg || '未知错误'
  // eslint-disable-next-line eqeqeq
  if (status != 200) {
    return Promise.reject(message)
  }
  if (status === 401) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('无权登录')
  }
  return res
}, (error) => {
  // eslint-disable-next-line no-alert
  alert(error)
  return Promise.reject(new Error(error))
})
