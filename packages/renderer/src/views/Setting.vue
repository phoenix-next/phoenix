<template>
  <!-- TODO: setting page -->
  <n-button
    type="primary"
    block
    secondary
    strong
    class="signout-btn"
    :disabled="!isLogin"
    @click="clickSignOut"
  >
    退出登录
  </n-button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const { isLogin, signOut } = useAuthStore()

function clickSignOut() {
  localStorage.removeItem('userID')
  localStorage.removeItem('token')
  signOut()
  window.$message.success('退出账号成功')
  router.push({ name: 'login' })
}
</script>

<style scoped></style>
