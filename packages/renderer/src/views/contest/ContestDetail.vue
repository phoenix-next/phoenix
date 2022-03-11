<template>
  <n-layout>
    <n-layout-header>
      <div class="center">
        <n-card class="header">
          <n-h1 style="margin-bottom: 3px">{{ data.name }}</n-h1>
          <n-tabs :value="tab" @update-value="handleUpdate">
            <n-tab-pane tab="比赛说明" name="profile" />
            <n-tab-pane tab="题目列表" name="problem" />
          </n-tabs>
        </n-card>
      </div>
    </n-layout-header>
    <n-layout has-sider sider-placement="right">
      <n-layout-content>
        <div class="center">
          <n-card class="content" v-if="tab === 'profile'">
            <n-p>开始时间：{{ data.startTime }}</n-p>
            <n-p>结束时间：{{ data.endTime }}</n-p>
            <n-p>{{ data.profile }}</n-p>
          </n-card>
          <n-card class="content" v-else>
            <template v-for="item in problemList">
              <n-card
                @click="enterProblem(item.problemID)"
                style="cursor: pointer"
              >
                <n-grid>
                  <n-grid-item span="15">{{ item.problemName }}</n-grid-item>
                  <n-grid-item span="7">
                    难度：{{ item.difficulty }}
                  </n-grid-item>
                  <n-grid-item span="2">T{{ item.problemID }}</n-grid-item>
                </n-grid>
              </n-card>
            </template>
          </n-card>
        </div>
      </n-layout-content>
      <n-layout-sider width="400">
        <div class="center">
          <n-card class="sider">
            <n-h2>排行榜</n-h2>
          </n-card>
        </div>
      </n-layout-sider>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, reactive } from 'vue'
import {
  NCard,
  NTabs,
  NTabPane,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NLayoutContent,
  NH1,
  NH2,
  NP,
  NGrid,
  NGridItem
} from 'naive-ui'
import { getContest } from '../../api/contest'

const route = useRoute()
const router = useRouter()
const tab = ref('problem')
const problemList = ref<any[]>([])
const data = reactive({
  name: 'Loading...',
  profile: 'Loading...',
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString()
})

function handleUpdate(value: any) {
  tab.value = value
}
function enterProblem(id: number) {
  router.push(`/problem/${id}`)
}

onMounted(() => {
  getContest({ id: route.params.id as string }).then((res) => {
    data.name = res.data.name
    data.profile = res.data.profile
    data.startTime = res.data.startTime
    data.endTime = res.data.endTime
    problemList.value = res.data.problem
  })
})
</script>

<style scoped>
.center {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header:deep(.n-card__content) {
  padding-bottom: 0;
}
.header {
  width: 99%;
  height: 95%;
  margin-top: 3px;
  margin-bottom: 5px;
}
.content {
  height: 630px;
  width: 98%;
}
.sider {
  height: 630px;
  width: 98%;
}
.sider:deep(.n-card__content) {
  padding-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
