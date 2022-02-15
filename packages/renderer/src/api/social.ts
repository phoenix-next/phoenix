import { backend } from '../utils/request'

export function login(data: { name: string; password: string }) {
  return backend.post('user/login', data)
}

export function getCaptcha(data: { email: string }) {
  return backend.post('user/captcha', data)
}

export function register(data: {
  captcha: number
  email: string
  name: string
  password: string
}) {
  return backend.post('user/register', data)
}
