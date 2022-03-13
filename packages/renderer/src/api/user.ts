import { backend } from '../utils/request'

export function login(data: { email: string; password: string }) {
  return backend.post('tokens', data)
}

export function getCaptcha(data: { email: string; type: number }) {
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

export function updateUserProfile(data: FormData) {
  return backend.put('users', data)
}

export function quitOrganization(data: { id: string }) {
  return backend.delete(`users/organizations/${data.id}`)
}

export function getUserInvitation() {
  return backend.get('users/invitations')
}
