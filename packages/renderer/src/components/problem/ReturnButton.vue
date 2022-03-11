<template>
  <n-button text class="return" @click="clickReturn">
    <n-icon>
      <arrow-back-circle-outline />
    </n-icon>
  </n-button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NIcon, NButton } from 'naive-ui'
import { ArrowBackCircleOutline } from '@vicons/ionicons5'

const router = useRouter()

function clickReturn() {
  router.back()
}
</script>

<style scoped>
.return {
  position: absolute;
  top: 20px;
  left: 24px;
  font-size: 30px;
}
</style>
