<template>
  <!-- TODO: forum page -->
  <n-card>
    <n-button text class="return" @click="clickReturn">
      <n-icon>
        <arrow-back-circle-outline />
      </n-icon>
    </n-button>
    <n-space justify="center">
      <n-h1 class="title"> 这个帖子的标题大概这么长 </n-h1>
    </n-space>
    <n-divider />
  </n-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowBackCircleOutline } from '@vicons/ionicons5'
import { NCard, NButton, NIcon, NSpace, NH1, NDivider } from 'naive-ui'

const router = useRouter()

function clickReturn() {
  router.back()
}
</script>

<style scoped>
.return {
  position: absolute;
  font-size: 30px;
}
</style>
