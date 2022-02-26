<template>
  <!-- TODO: problem page -->
  <n-button
    type="primary"
    block
    secondary
    strong
    :disabled="!isLogin"
    @click="clickCreate"
  >
    创建题目
  </n-button>
  <n-button
    type="primary"
    block
    secondary
    strong
    @click="test"
    style="margin-top: 10px"
  >
    评测题目的测试
  </n-button>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const { isLogin } = useAuthStore()
const router = useRouter()

function clickCreate() {
  router.push({ path: '/problem/create' })
}

function test() {
  router.push({ path: '/problem/1' })
}
</script>

<style scoped></style>
