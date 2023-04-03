import axios from 'axios'

const backend = axios.create({
  baseURL: 'http://43.143.161.129:8083/api/v1/'
})

backend.interceptors.request.use((config) => {
  config.headers = { 'x-token': localStorage.getItem('token') || '' }
  return config
})

backend.interceptors.response.use(
  (response) => {
    if (!response.data.success) {
      window.$message.warning(response.data.message)
    } else if (response.data.message) {
      window.$message.success(response.data.message)
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
