import { backend } from '../utils/request'

export function getProblemList() {
  return backend.get('problems')
}

export function createProblem() {
  return backend.post('problems')
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
