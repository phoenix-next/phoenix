import { AxiosResponse } from 'axios'
import { idID } from 'naive-ui'
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
    params: data
  })
}

export function getOrganization() {
  return backend.get('user/organizations')
}

export function createOrganization(data: { name: string; profile: string }) {
  return backend.post('organizations/', data)
}

export function updateOrganization(
  data: { name: string; profile: string },
  teamId: number
) {
  return backend.put('organizations/' + teamId.toString, data)
}

export function deleteOrganization(teamId: number) {
  return backend.delete('organizations/' + teamId.toString)
}

export function createInvitation(data: { email: string }, teamId: number) {
  return backend.post('organizations/' + teamId.toString + '/invitations', data)
}

export function updateOrganizationMember(teamId: number) {
  return backend.post('organizations/' + teamId.toString + '/users')
}

export function getOrganizationMember(teamId: number): Promise<
  AxiosResponse<{
    success: boolean
    teamList: {
      name: string
      isAdmin: boolean
      email: string
    }[]
  }>
> {
  return backend.get('organizations/' + teamId.toString + '/users')
}

export function updateOrganizationAdmin(data: { id: string }, teamId: number) {
  return backend.post('organizations/' + teamId.toString + '/admins', data)
}

export function deleteOrganizationAdmin(adminId: number, teamId: number) {
  return backend.delete(
    'organizations/' + teamId.toString + '/admins/' + adminId.toString
  )
}
