import { backend } from '../utils/request'

export function getContestList(data: {
  page: number
  keyWord: string
  sorter: number
}) {
  return backend.get('contests', { params: data })
}

export function CreateContest(data: {
  name: string
  orgID: number
  profile: string
  readable: number
  problemIDs: Array<number>
}) {
  return backend.post('contests', data)
}

export function getContest(data: { id: string }) {
  return backend.get('contests/' + data.id)
}

export function updateContest(data: {
  id: string
  name: string
  profile: string
  problemIDs: Array<number>
}) {
  return backend.put('contests/' + data.id, data)
}

export function deleteContest(data: { id: string }) {
  return backend.delete('contests/' + data.id)
}

export function getOrgProblems(data: { id: number }) {
  return backend.get(`organizations/${data.id}/problems`)
}
