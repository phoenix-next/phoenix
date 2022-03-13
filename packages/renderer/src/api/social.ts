import { backend } from '../utils/request'

export function createOrganization(data: { name: string; profile: string }) {
  return backend.post('organizations', data)
}

export function getOrganization(teamId: string) {
  return backend.get(`organizations/${teamId}`)
}

export function updateOrganization(
  data: { name: string; profile: string },
  teamId: string
) {
  return backend.put(`organizations/${teamId}`, data)
}

export function deleteOrganization(teamId: string) {
  return backend.delete(`organizations/${teamId}`)
}

export function createInvitation(
  data: { email: string; isAdmin: boolean },
  teamId: string
) {
  return backend.post(`organizations/${teamId}/invitations`, data)
}

export function updateOrganizationMember(teamId: string) {
  return backend.post(`organizations/${teamId}/users`)
}

export function deleteOrganizationMember(
  teamId: string,
  userId: number | string
) {
  return backend.delete(`organizations/${teamId}/users/${userId}`)
}

export function getOrganizationMember(teamId: string) {
  return backend.get(`organizations/${teamId}/users`)
}

export function updateOrganizationAdmin(data: { id: number }, teamId: string) {
  return backend.post(`organizations/${teamId}/admins`, data)
}

export function deleteOrganizationAdmin(
  adminId: number | string,
  teamId: string
) {
  return backend.delete(`organizations/${teamId}/admins/${adminId}`)
}
