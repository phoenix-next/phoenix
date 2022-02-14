import { defineStore } from 'pinia'
import { ref } from 'vue'

// 登录成功以在线模式运行，登录失败以离线模式运行
export const useAuthStore = defineStore('counter', () => {
  const isLogin = ref(false)

  function login() {
    isLogin.value = true
  }
  function logout() {
    isLogin.value = false
  }

  return { isLogin, login, logout }
})
