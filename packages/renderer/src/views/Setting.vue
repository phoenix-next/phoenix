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
  <n-button @click="test"> 测试 </n-button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const messager = useMessage()
const { isLogin, signOut } = useAuthStore()

function clickSignOut() {
  localStorage.removeItem('userID')
  localStorage.removeItem('token')
  signOut()
  messager.success('退出账号成功')
  router.push({ name: 'login' })
}

function test() {
  window.utilsBridge.judge().then((res) => {
    console.log(res)
  })
}
</script>

<style scoped></style>
