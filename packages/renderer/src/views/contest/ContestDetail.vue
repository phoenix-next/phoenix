<template>
  <n-layout>
    <n-layout-header>
      <div class="center fill">
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
        <div class="center fill">
          <n-card class="content" v-if="tab === 'profile'">
            <n-p>开始时间：{{ data.startTime }}</n-p>
            <n-p>结束时间：{{ data.endTime }}</n-p>
            <n-p>{{ data.profile }}</n-p>
          </n-card>
          <n-card class="content" v-else>
            <template v-for="item in problemList">
              <n-card
                @click="enterProblem(item.problemID)"
                style="cursor: pointer; margin-top: 4px"
              >
                <n-grid>
                  <n-grid-item span="2" class="center">
                    <NIcon size="20" color="#626262" v-if="item.result === 0">
                      <RemoveSharp />
                    </NIcon>
                    <NIcon
                      size="20"
                      color="#0e7a0d"
                      v-else-if="item.result > 0"
                    >
                      <CheckmarkDoneOutline />
                    </NIcon>
                    <NIcon size="20" color="#FF3939" v-else>
                      <Close />
                    </NIcon>
                  </n-grid-item>
                  <n-grid-item span="10" class="center">
                    {{ item.problemName }}
                  </n-grid-item>
                  <n-grid-item span="2">难度：</n-grid-item>
                  <n-grid-item span="7" class="center">
                    <NProgress
                      :percentage="(item.difficulty as number) * 10"
                      :showIndicator="false"
                      :status="getStatus(item.difficulty)"
                    />
                  </n-grid-item>
                  <n-grid-item span="2" offset="1" class="center">
                    T{{ item.problemID }}
                  </n-grid-item>
                </n-grid>
              </n-card>
            </template>
          </n-card>
        </div>
      </n-layout-content>
      <n-layout-sider width="400">
        <div class="center fill">
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
import { CheckmarkDoneOutline, Close, RemoveSharp } from '@vicons/ionicons5'
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
  NGridItem,
  NProgress,
  NIcon
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
function getStatus(difficulty: any) {
  if ((difficulty as number) > 8) return 'error'
  else if ((difficulty as number) > 5) return 'warning'
  else if ((difficulty as number) > 3) return 'success'
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.fill {
  height: 100%;
  width: 100%;
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
