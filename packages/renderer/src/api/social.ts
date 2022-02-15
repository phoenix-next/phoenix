import { request } from '../utils/request'

export function login(data: { name: string; password: string }) {
  return request.post('user/login', data)
}

export function getCaptcha(data: { email: string }) {
  return request.post('user/captcha', data)
}

export function register(data: {
  captcha: number
  email: string
  name: string
  password: string
}) {
  return request.post('user/register', data)
}
