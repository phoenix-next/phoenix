import { request } from '../utils/request'

export function login(data: { name: string; password: string }) {
  return request.post('token', data)
}
