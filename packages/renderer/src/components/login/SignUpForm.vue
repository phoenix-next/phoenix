<template>
  <n-form :rules="rules" :model="data">
    <n-form-item-row label="邮箱" path="email">
      <n-input v-model:value="data.email" placeholder="输入邮箱" />
    </n-form-item-row>
    <n-form-item-row label="用户名" path="name">
      <n-input v-model:value="data.name" placeholder="输入用户名" />
    </n-form-item-row>
    <n-form-item-row label="密码" path="password">
      <n-input v-model:value="data.password" placeholder="输入密码" />
    </n-form-item-row>
    <n-form-item-row label="重复密码" path="confirm_password">
      <n-input
        v-model:value="data.confirm_password"
        placeholder="重复输入密码"
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
import { ref } from 'vue'
import { getCaptcha, register } from '../../api/social'
import { useMessage } from 'naive-ui'

const messager = useMessage()

const data = ref({
  email: '',
  name: '',
  password: '',
  confirm_password: '',
  captcha: '',
})

const rules = {
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur',
  },
  name: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
  confirm_password: {
    required: true,
    message: '请重复输入密码',
    trigger: 'blur',
  },
  captcha: {
    required: true,
    message: '请输入验证码',
    trigger: 'blur',
  },
}

function clickRegister() {
  // TODO: form validation
  register(data.value)
    .then((res) => {
      if (res.data.success) {
        messager.success(res.data.message)
      } else {
        messager.warning(res.data.message)
      }
    })
    .catch((res) => {
      messager.error('网络故障, 请检查网络连接')
    })
}

function clickGetCaptcha() {
  getCaptcha({ email: data.value.email })
    .then((res) => {
      if (res.data.success) {
        messager.success(res.data.message)
      } else {
        messager.warning(res.data.message)
      }
    })
    .catch((res) => {
      messager.error('网络故障, 请检查网络连接')
    })
}
</script>

<style scoped>
.signup-btn {
  margin-top: 1.5vh;
}
</style>
