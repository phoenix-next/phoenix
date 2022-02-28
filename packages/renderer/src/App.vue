<template>
  <n-message-provider>
    <n-layout has-sider position="absolute">
      <n-layout-sider collapsed collapse-mode="width" bordered>
        <n-layout-header position="absolute">
          <n-menu collapsed :options="topMenuOptions" class="top-menu" />
        </n-layout-header>
        <n-layout-footer position="absolute">
          <n-menu collapsed :options="bottomMenuOptions" class="bottom-menu" />
        </n-layout-footer>
      </n-layout-sider>
      <n-layout-content>
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-message-provider>
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

<style scoped>
.bottom-menu {
  margin-bottom: 0.5vh;
}
</style>
