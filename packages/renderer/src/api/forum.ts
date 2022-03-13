import { backend } from '../utils/request'

export function getPosts(data: { id: number; type: number; page: number }) {
  return backend.get('posts', {
    params: data
  })
}

export function createPosts(data: {
  content: string
  orgID: number
  title: string
  type: number
}) {
  return backend.post('posts', data)
}

export function deletePosts(data: { id: number }) {
  return backend.delete(`posts/${data.id}`)
}

export function createComments(data: {
  id: number
  content: string
  toID: number
}) {
  return backend.post(`posts/${data.id}/comments`, data)
}

export function getAllComments(data: { id: number }) {
  return backend.get(`posts/${data.id}/comments`)
}
