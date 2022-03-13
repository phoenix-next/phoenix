import { backend } from '../utils/request'

export function getToturialList(data: {
  page: number
  sorter: number
  keyWord: string
}) {
  return backend.get('tutorials', {
    params: data
  })
}

export function createTutorial(data: FormData) {
  return backend.post('tutorials', data)
}

export function getTutorial(data: { tutorialID: number }) {
  return backend.get(`tutorials/${data.tutorialID}`)
}

export function updateTutorial(data: FormData) {
  return backend.put(`tutorials/${data.get('id')}`, data)
}

export function deleteTutorial(data: { tutorialID: number }) {
  return backend.delete(`tutorials/${data.tutorialID}`)
}

export function getTutorialVersion(data: { tutorialID: number }) {
  return backend.get(`tutorials/${data.tutorialID}/version`)
}
