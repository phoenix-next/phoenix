import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const isLogin = computed(() => {
    return token.value !== ''
  })

  function signIn(userToken: string) {
    token.value = userToken
  }
  function signOut() {
    token.value = ''
  }

  return { token, isLogin, signIn, signOut }
})
