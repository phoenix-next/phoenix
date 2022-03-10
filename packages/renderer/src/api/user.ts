import { backend } from '../utils/request'

export function login(data: { email: string; password: string }) {
  return backend.post('tokens', data)
}

export function getCaptcha(data: { email: string }) {
  return backend.post('captcha', data)
}

export function register(data: {
  captcha: string
  email: string
  name: string
  password: string
}) {
  return backend.post('users', data)
}

export function getProfile(data: { id: string }) {
  return backend.get(`users/${data.id}`)
}

export function getUserOrganization() {
  return backend.get(`users/organizations`)
}
