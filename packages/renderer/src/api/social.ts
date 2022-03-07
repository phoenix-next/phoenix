import { AxiosResponse } from 'axios'
import { backend } from '../utils/request'

export function createOrganization(data: {
  name: string
  profile: string
}): Promise<AxiosResponse<{ success: boolean }>> {
  return backend.post('organizations/', data)
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
  return backend.get(`organizations/${teamId}/users`)
}

export function updateOrganizationAdmin(data: { id: string }, teamId: number) {
  return backend.post(`organizations/${teamId}/admins`, data)
}

export function deleteOrganizationAdmin(adminId: number, teamId: number) {
  return backend.delete(`organizations/${teamId}/admins/${adminId}`)
}
