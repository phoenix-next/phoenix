<template>
  <n-layout has-sider>
    <n-layout-sider>
      <n-menu :options="menuOptions" />
    </n-layout-sider>
    <n-layout-content>
      <router-view />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import {
  BookOutline,
  DesktopOutline,
  List,
  LogoStackoverflow,
  People,
} from '@vicons/ionicons5'
import { createMenuOptions } from './utils/naive'

const menuOptions = createMenuOptions([
  { path: '/tutorial', name: '教程', icon: BookOutline },
  { path: '/contest', name: '比赛', icon: DesktopOutline },
  { path: '/problem', name: '题库', icon: List },
  { path: '/forum', name: '论坛', icon: LogoStackoverflow },
  { path: '/team', name: '组织', icon: People },
])
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
