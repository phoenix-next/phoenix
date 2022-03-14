<template>
  <div class="container">
    <n-result
      status="404"
      title="404 资源不存在"
      description="没有任何设置可以设置"
    >
      <template #footer>
        <n-button style="margin-right: 6px">关于</n-button>
        <n-button>检查更新</n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup lang="ts">
import { NResult, NButton } from 'naive-ui'
</script>

<style scoped>
.container {
  height: 80%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
