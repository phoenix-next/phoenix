<template>
  <n-layout has-sider position="absolute">
    <n-layout-sider collapsed collapse-mode="width">
      <n-menu :options="topMenuOptions" class="top-menu" />
      <n-menu :options="bottomMenuOptions" class="bottom-menu" />
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
  SettingsOutline,
  PersonCircleOutline,
} from '@vicons/ionicons5'
import { createMenuOptions } from './utils/naive'

const topMenuOptions = createMenuOptions([
  { path: '/tutorial', name: '教程', icon: BookOutline },
  { path: '/contest', name: '比赛', icon: DesktopOutline },
  { path: '/problem', name: '题库', icon: List },
  { path: '/forum', name: '论坛', icon: LogoStackoverflow },
  { path: '/team', name: '组织', icon: People },
])

const bottomMenuOptions = createMenuOptions([
  { path: '/login', name: '个人资料', icon: PersonCircleOutline },
  { path: '/setting', name: '设置', icon: SettingsOutline },
])
</script>

<style>
.top-menu {
  position: absolute;
  top: 1%;
}

.bottom-menu {
  position: absolute;
  bottom: 1%;
}
</style>
