import { backend } from '../utils/request'

export function getProblemList(data: { page: number; sorter: number }) {
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

export function updateProblem(data: { problemID: number }) {
  return backend.put(`problems/${data.problemID}`)
}

export function deleteProblem(data: { problemID: number }) {
  return backend.delete(`problems/${data.problemID}`)
}

export function getProblemVersion(data: { problemID: number }) {
  return backend.get(`problems/${data.problemID}/version`)
}
