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
