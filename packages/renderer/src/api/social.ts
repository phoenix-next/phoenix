import { backend } from '../utils/request'

export function createOrganization(data: { name: string; profile: string }) {
  return backend.post('organizations', data)
}

export function getOrganization(teamId: number | string) {
  return backend.get(`organizations/${teamId}`)
}

export function updateOrganization(
  data: { name: string; profile: string },
  teamId: string
) {
  return backend.put(`organizations/${teamId}`, data)
}

export function deleteOrganization(teamId: number | string) {
  return backend.delete(`organizations/${teamId}`)
}

export function createInvitation(
  data: { email: string; isAdmin: boolean },
  teamId: number | string
) {
  return backend.post(`organizations/${teamId}/invitations`, data)
}

export function updateOrganizationMember(teamId: number | string) {
  return backend.post(`organizations/${teamId}/users`)
}

export function deleteOrganizationMember(
  teamId: number | string,
  userId: number | string
) {
  return backend.delete(`organizations/${teamId}/users/${userId}`)
}

export function getOrganizationMember(teamId: number | string) {
  return backend.get(`organizations/${teamId}/users`)
}

export function updateOrganizationAdmin(
  data: { id: number },
  teamId: number | string
) {
  return backend.post(`organizations/${teamId}/admins`, data)
}

export function deleteOrganizationAdmin(
  adminId: number | string,
  teamId: number | string
) {
  return backend.delete(`organizations/${teamId}/admins/${adminId}`)
}
