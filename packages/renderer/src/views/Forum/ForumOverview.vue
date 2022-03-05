<template>
  <!-- TODO: forum page -->
  <n-card>
    <n-grid>
      <n-gi :span="5">
        <n-h2>
          <n-text type="primary"> 最近讨论 </n-text>
        </n-h2>
      </n-gi>
      <n-gi :span="14" :offset="2">
        <n-input-group>
          <n-button type="primary" class="label">查找帖子</n-button>
          <n-input :style="{ width: '50%' }" />
          <n-button type="primary" ghost>搜索</n-button>
        </n-input-group>
      </n-gi>
    </n-grid>
    <n-grid :x-gap="12" :y-gap="8" :cols="2">
      <n-gi v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]">
        <n-card>
          <n-layout has-sider>
            <n-layout-sider bordered :width="80">
              <n-avatar
                round
                :size="60"
                src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
              />
            </n-layout-sider>
            <n-layout>
              <n-layout-content>
                <n-text @click="handleClick">
                  第 {{ i }} 个人的帖子标题
                </n-text>
                <br />
                <n-text> 第 {{ i }} 个人的名字 </n-text>
                <br />
                <n-text>
                  Last Mentioned in: 这玩意最后一次被回复 / 提及的时间
                </n-text>
              </n-layout-content>
            </n-layout>
          </n-layout>
        </n-card>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function handleClick() {
  router.push('/forum/1')
}
</script>

<style scoped></style>
