import { defineStore } from 'pinia'
import { ref } from 'vue'

// 这只是一个示例，登录与否用LocalStorage中的userID是否存在来判断
// 登录时LocalStorage中还会存储token，用于api交互
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
