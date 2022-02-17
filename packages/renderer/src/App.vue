<template>
  <n-layout has-sider></n-layout>
  <n-button type="info" @click="jump" style="margin-right: 5px">跳转</n-button>
  <n-button type="info" @click="render">渲染</n-button>
  <div>{{ data }}</div>
  <router-view />
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { useRoute, useRouter } from 'vue-router'
import { common } from './utils/request'
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()

const jump = () => {
  let to = route.path === '/' ? '/login' : '/'
  router.push(to)
}

const data = ref('')

const render = async () => {
  let res = await common.get('http://phoenix.matrix53.top/swagger/index.html')
  data.value = res.data.substring(1, 20)
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo-box {
  display: flex;
  width: 100%;
  justify-content: center;
}

.logo-box span {
  width: 74px;
}

.static-public {
  display: flex;
  align-items: center;
  justify-content: center;
}

.static-public code {
  background-color: #eee;
  padding: 2px 4px;
  margin: 0 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
