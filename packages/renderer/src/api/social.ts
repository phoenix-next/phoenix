import { backend } from '../utils/request'

export function login(data: { email: string; password: string }) {
  return backend.post('user/login', data)
}

export function getCaptcha(data: { email: string }) {
  return backend.post('user/captcha', data)
}

export function register(data: {
  captcha: string
  email: string
  name: string
  password: string
}) {
  return backend.post('user/register', data)
}

export function getProfile(data: { id: string }) {
  return backend.get('user/profile', {
    params: {
      id: data.id
    }
  })
}

export function getOrganization() {
  return backend.get('user/organizations')
}
