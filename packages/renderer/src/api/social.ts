import { backend } from '../utils/request'

export function createOrganization(data: { name: string; profile: string }) {
  return backend.post('organizations', data)
}

export function getOrganization(teamID: string) {
  return backend.get(`organizations/${teamID}`)
}

export function updateOrganization(data: FormData, teamID: string) {
  return backend.put(`organizations/${teamID}`, data)
}

export function deleteOrganization(teamID: string) {
  return backend.delete(`organizations/${teamID}`)
}

export function createInvitation(data: {
  email: string
  isAdmin: boolean
  teamID: string
}) {
  return backend.post(`organizations/${data.teamID}/invitations`, data)
}

export function updateOrganizationMember(data: {
  teamID: number
  accept: boolean
}) {
  return backend.post(`organizations/${data.teamID}/users`, data)
}

export function deleteOrganizationMember(teamID: string, userId: number) {
  return backend.delete(`organizations/${teamID}/users/${userId}`)
}

export function getOrganizationMember(teamID: string) {
  return backend.get(`organizations/${teamID}/users`)
}

export function updateOrganizationAdmin(data: {
  userID: number
  teamID: string
}) {
  return backend.post(`organizations/${data.teamID}/admins`, {
    id: data.userID
  })
}

export function deleteOrganizationAdmin(adminId: number, teamID: string) {
  return backend.delete(`organizations/${teamID}/admins/${adminId}`)
}
