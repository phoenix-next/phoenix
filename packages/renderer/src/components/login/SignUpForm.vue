<template>
  <n-form :rules="rules" :model="data">
    <n-form-item-row label="邮箱" path="email">
      <n-input v-model:value="data.email" placeholder="输入邮箱" />
    </n-form-item-row>
    <n-form-item-row label="用户名" path="name">
      <n-input v-model:value="data.name" placeholder="输入用户名" />
    </n-form-item-row>
    <n-form-item-row label="密码" path="password">
      <n-input
        v-model:value="data.password"
        placeholder="输入密码"
        type="password"
        show-password-on="mousedown"
      />
    </n-form-item-row>
    <n-form-item-row label="重复密码" path="confirm_password">
      <n-input
        v-model:value="data.confirm_password"
        placeholder="重复输入密码"
        type="password"
        show-password-on="mousedown"
      />
    </n-form-item-row>
    <n-form-item-row label="验证码" path="captcha">
      <n-input v-model:value="data.captcha" placeholder="输入验证码" />
    </n-form-item-row>
  </n-form>
  <n-button
    type="primary"
    block
    secondary
    strong
    class="captcha-btn"
    @click="clickGetCaptcha"
  >
    发送验证码
  </n-button>
  <n-button
    type="primary"
    block
    secondary
    strong
    class="signup-btn"
    @click="clickRegister"
  >
    注册
  </n-button>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { getCaptcha, register } from '../../api/social'

const data = reactive({
  email: '',
  name: '',
  password: '',
  confirm_password: '',
  captcha: ''
})

const rules = {
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur'
  },
  name: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  },
  confirm_password: {
    required: true,
    message: '请重复输入密码',
    trigger: 'blur'
  },
  captcha: {
    required: true,
    message: '请输入验证码',
    trigger: 'blur'
  }
}

function clickRegister() {
  if (
    !data.captcha ||
    !data.confirm_password ||
    !data.name ||
    !data.email ||
    !data.password
  ) {
    window.$message.warning('请输入完整的注册信息')
    return
  }
  if (data.confirm_password !== data.password) {
    window.$message.warning('两次输入的密码不同')
    return
  }
  register(data)
    .then((res) => {
      if (res.data.success) {
        window.$message.success(res.data.message)
      } else {
        window.$message.warning(res.data.message)
      }
    })
    .catch((res) => {
      window.$message.error('网络故障, 请检查网络连接')
    })
}

function clickGetCaptcha() {
  if (data.email === '') {
    window.$message.warning('请先输入您的邮箱')
    return
  }
  getCaptcha({ email: data.email })
    .then((res) => {
      if (res.data.success) {
        window.$message.success(res.data.message)
      } else {
        window.$message.warning(res.data.message)
      }
    })
    .catch((res) => {
      window.$message.error('网络故障, 请检查网络连接')
    })
}
</script>

<style scoped>
.signup-btn {
  margin-top: 1.5vh;
}
</style>
