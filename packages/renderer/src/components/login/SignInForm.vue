<template>
  <n-form :model="data" :rules="rules">
    <n-form-item-row label="邮箱" path="email">
      <n-input
        v-model:value="data.email"
        placeholder="输入邮箱"
        @keypress.enter="clickLogin"
      />
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
  <n-button
    type="primary"
    block
    secondary
    strong
    @click="clickForget"
    style="margin-top: 1.5vh"
  >
    忘记密码
  </n-button>
  <forget-password ref="modal" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { login } from '../../api/user'
import { useAuthStore } from '../../stores/auth'
import { useRoute, useRouter } from 'vue-router'
import { NForm, NFormItemRow, NButton, NInput } from 'naive-ui'
import ForgetPassword from './ForgetPassword.vue'

const router = useRouter()
const route = useRoute()
const { signIn } = useAuthStore()

const modal = ref<InstanceType<typeof ForgetPassword> | null>(null)
const data = reactive({
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

function clickForget() {
  modal.value?.openModal()
}
function clickLogin() {
  if (data.email === '' || data.password === '') {
    window.$message.warning('请输入完整的登录信息')
    return
  }
  login(data).then((res) => {
    if (res.data.success) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userID', res.data.id)
      signIn(res.data.token)
      if (route.query['redirect']) {
        router.push({ path: route.query['redirect'] as string })
      } else {
        router.push({ path: '/tutorial' })
      }
    }
  })
}
</script>

<style scoped></style>
