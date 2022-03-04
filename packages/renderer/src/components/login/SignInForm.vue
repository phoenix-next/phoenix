<template>
  <n-form :model="data" :rules="rules">
    <n-form-item-row label="邮箱" path="email">
      <n-input v-model:value="data.email" placeholder="输入邮箱" />
    </n-form-item-row>
    <n-form-item-row label="密码" path="password">
      <n-input
        v-model:value="data.password"
        placeholder="输入密码"
        type="password"
        show-password-on="mousedown"
        @keypress.enter="clickLogin"
      />
    </n-form-item-row>
  </n-form>
  <n-button type="primary" block secondary strong @click="clickLogin">
    登录
  </n-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { login } from '../../api/social'
import { useMessage } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const messager = useMessage()
const router = useRouter()
const route = useRoute()
const { signIn } = useAuthStore()

const data = ref({
  email: '',
  password: ''
})

const rules = {
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
}

function clickLogin() {
  login(data.value)
    .then((res) => {
      if (res.data.success) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userID', res.data.id)
        signIn(res.data.token)
        messager.success(res.data.message)
        if (route.query['redirect']) {
          router.push({ path: route.query['redirect'] as string })
        } else {
          router.push({ path: '/tutorial' })
        }
      } else {
        messager.warning(res.data.message)
      }
    })
    .catch((res) => {
      messager.error('网络故障, 请检查网络连接')
    })
}
</script>

<style scoped></style>
