import { defineStore } from 'pinia'
import { ref } from 'vue'

// 是否登录也可用localStorage直接判断
export const useAuthStore = defineStore('auth', () => {
  const isLogin = ref(localStorage.getItem('token') !== null)

  function signIn() {
    isLogin.value = true
  }
  function signOut() {
    isLogin.value = false
  }

  return { isLogin, signIn, signOut }
})
