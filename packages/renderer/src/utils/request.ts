import axios from 'axios'

const backend = axios.create({
  baseURL: 'https://phoenix.matrix53.top/api/v1/'
})

backend.interceptors.request.use((config) => {
  config.headers = { 'x-token': localStorage.getItem('token') || '' }
  return config
})

backend.interceptors.response.use(
  (response) => {
    if (!response.data.success) {
      window.$message.warning(response.data.message)
    }
    return response
  },
  (error) => {
    window.$message.error('网络故障, 请检查网络连接')
    return Promise.reject(error)
  }
)

const common = axios.create({})

export { backend, common }
