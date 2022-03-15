import { AxiosResponse } from 'axios'
import { backend } from '../utils/request'

export function getProblemList(data: {
  page: number
  sorter: number
  keyWord: string
}) {
  return backend.get('problems', {
    params: data
  })
}

export function createProblem(data: FormData) {
  return backend.post('problems', data)
}

export function getProblem(data: { problemID: number }) {
  return backend.get(`problems/${data.problemID}`)
}

export function updateProblem(data: FormData) {
  return backend.put(`problems/${data.get('id')}`, data)
}

export function deleteProblem(data: { problemID: number }) {
  return backend.delete(`problems/${data.problemID}`)
}

export function getProblemVersion(data: { problemID: number }) {
  return backend.get(`problems/${data.problemID}/version`)
}

export function uploadRecord(data: FormData) {
  return backend.post(`problems/${data.get('id')}/records`, data)
}
