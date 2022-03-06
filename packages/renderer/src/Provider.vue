<template>
  <n-config-provider :locale="zhCN">
    <n-message-provider>
      <app />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import App from './App.vue'
import { zhCN, NMessageProvider, NConfigProvider } from 'naive-ui'
</script>
