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
    <n-card
      v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      style="margin-top: 20px"
    >
      第 {{ i }} 个人的名字 <br />
      第 {{ i }} 个人的回复内容
    </n-card>
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
