import { backend } from '../utils/request'

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

export function updatePosts(data: {
  id: number
  content: string
  title: string
  type: number
}) {
  return backend.put(`posts/${data.id}`, data)
}

export function getAllPosts(data: { id: number; type: number; page: number }) {
  return backend.get('posts', {
    params: data
  })
}

export function getPosts(id: number) {
  return backend.get(`posts/${id}`)
}

export function createComments(data: {
  id: number
  content: string
  toID: number
}) {
  return backend.post(`posts/${data.id}/comments`, data)
}

export function deleteComment(id: number) {
  return backend.delete(`comments/${id}`)
}

export function updateComments(data: { id: number; content: string }) {
  return backend.put(`comments/${data.id}`, data)
}

export function getAllComments(id: number) {
  return backend.get(`posts/${id}/comments`)
}
