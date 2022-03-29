<template>
  <n-layout has-sider position="absolute">
    <n-layout-sider collapsed collapse-mode="width" bordered>
      <n-layout-header position="absolute">
        <n-menu
          collapsed
          :options="topMenuOptions"
          class="top-menu"
          :value="topValue"
          @update-value="handleTopUpdate"
        />
      </n-layout-header>
      <n-layout-footer position="absolute">
        <n-menu
          collapsed
          :options="bottomMenuOptions"
          class="bottom-menu"
          :value="bottomValue"
          @update-value="handleBottomUpdate"
        />
      </n-layout-footer>
    </n-layout-sider>
    <n-layout-content class="content">
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
  PersonCircleOutline
} from '@vicons/ionicons5'
import { createMenuOptions } from './utils/naive'
import {
  useMessage,
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutFooter,
  NLayoutContent,
  NMenu
} from 'naive-ui'
import { ref } from 'vue'

window.$message = useMessage()

const topValue = ref<string | null>(null)
const bottomValue = ref<string | null>(null)

function handleTopUpdate(key: string) {
  bottomValue.value = null
  topValue.value = key
}
function handleBottomUpdate(key: string) {
  topValue.value = null
  bottomValue.value = key
}

const topMenuOptions = createMenuOptions([
  { path: '/tutorial', name: '教程', icon: BookOutline },
  { path: '/contest', name: '比赛', icon: DesktopOutline },
  { path: '/problem', name: '题库', icon: List },
  { path: '/forum', name: '论坛', icon: LogoStackoverflow },
  { path: '/team', name: '组织', icon: People }
])

const bottomMenuOptions = createMenuOptions([
  { path: '/login', name: '个人资料', icon: PersonCircleOutline },
  { path: '/setting', name: '设置', icon: SettingsOutline }
])
</script>

<style scoped>
.bottom-menu {
  margin-bottom: 0.5vh;
}
.content:deep(.n-layout-scroll-container)::-webkit-scrollbar {
  width: 9px;
  background-color: #eee;
}
.content:deep(.n-layout-scroll-container)::-webkit-scrollbar-thumb {
  border-radius: 20px;
  border: 1px solid #ddd;
  background-color: #ccc;
}
.content:deep(.n-layout-scroll-container)::-webkit-scrollbar-track {
  border-radius: 20px;
}
</style>
