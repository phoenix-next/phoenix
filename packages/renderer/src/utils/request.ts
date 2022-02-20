import axios from 'axios'

const backend = axios.create({
  baseURL: 'https://phoenix.matrix53.top/api/v1/',
  headers: {
    'x-token': localStorage.getItem('token') || '',
  },
})

const common = axios.create({})

export { backend, common }
