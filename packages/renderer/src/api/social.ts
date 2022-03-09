import { AxiosResponse } from 'axios'
import { backend } from '../utils/request'

export function createOrganization(data: {
  name: string
  profile: string
}): Promise<AxiosResponse<{ success: boolean }>> {
  return backend.post('organizations/', data)
}

export function getOrganization(teamId: number) {
  return backend.get(`organizations/${teamId}`)
}

export function updateOrganization(
  data: { name: string; profile: string },
  teamId: number
) {
  return backend.put(`organizations/${teamId}`, data)
}

export function deleteOrganization(teamId: number) {
  return backend.delete(`organizations/${teamId}`)
}

export function createInvitation(
  data: { email: string; isAdmin: Boolean },
  teamId: number
) {
  return backend.post(`organizations/${teamId}/invitations`, data)
}

export function updateOrganizationMember(teamId: number) {
  return backend.post(`organizations/${teamId}/users`)
}

export function deleteOrganizationMember(
  teamId: number,
  userId: number | undefined
) {
  return backend.delete(`organizations/${teamId}/users/${userId}`)
}

export function getOrganizationMember(teamId: number): Promise<
  AxiosResponse<{
    success: boolean
    members: {
      id: number
      name: string
      isAdmin: boolean
      email: string // To be add
    }[]
  }>
> {
  return backend.get(`organizations/${teamId}/users`)
}

export function updateOrganizationAdmin(
  data: { id: string | undefined },
  teamId: number
) {
  return backend.post(`organizations/${teamId}/admins`, data)
}

export function deleteOrganizationAdmin(
  adminId: number | undefined,
  teamId: number
) {
  return backend.delete(`organizations/${teamId}/admins/${adminId}`)
}
