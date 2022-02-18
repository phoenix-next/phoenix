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
  </n-form>
  <n-button type="primary" block secondary strong>注册</n-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data = ref({
  email: '',
  name: '',
  password: '',
  confirm_password: '',
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
}
</script>

<style scoped></style>
