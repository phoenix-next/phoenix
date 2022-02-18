<template>
  <n-form :model="data" :rules="rules">
    <n-form-item-row label="邮箱" path="email">
      <n-input v-model:value="data.email" placeholder="输入邮箱" />
    </n-form-item-row>
    <n-form-item-row label="密码" path="password">
      <n-input v-model:value="data.password" placeholder="输入密码" />
    </n-form-item-row>
  </n-form>
  <n-button type="primary" block secondary strong @click="clickLogin"
    >登录</n-button
  >
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { login } from '../../api/social'

const data = ref({
  email: '',
  password: '',
})

const rules = {
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur',
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
}

function clickLogin() {
  login(data.value).then((res) => {
    console.log(res.data)
  })
}
</script>

<style scoped></style>
