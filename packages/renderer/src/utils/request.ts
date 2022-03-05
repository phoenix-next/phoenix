import axios from 'axios'

const backend = axios.create({
  baseURL: 'https://phoenix.matrix53.top/api/v1/'
})

backend.interceptors.request.use((config) => {
  config.headers = { 'x-token': localStorage.getItem('token') || '' }
  return config
})

const common = axios.create({})

export { backend, common }
